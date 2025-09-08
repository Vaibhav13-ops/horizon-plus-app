const axios = require('axios');
const JoyLogEntry = require('../models/JoyLogEntry.js');
const primaryAIService = require('./primaryAIService.js'); 

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;


const findTopYouTubeVideos = async (entryId, text) => {
    try {
        const searchQueries = await generateSearchQueries(text);
        if (!searchQueries || searchQueries.length === 0) {
            throw new Error("AI failed to generate search queries.");
        }

        let allVideosWithStats = [];
        for (const query of searchQueries) {
            const videos = await searchYouTubeAndFetchStats(query);
            allVideosWithStats.push(...videos);
        }

        const topVideos = rankAndSelectVideos(allVideosWithStats, 3);

        await JoyLogEntry.findByIdAndUpdate(entryId, {
            aiRecommendations: topVideos,
            recommendationsLoading: false,
        });

        console.log(`Successfully generated and ranked recommendations for Joy Log entry: ${entryId}`);

    } catch (error) {
        console.error(`Error in AI recommendation agent for entry ${entryId}:`, error);
        await JoyLogEntry.findByIdAndUpdate(entryId, { recommendationsLoading: false });
    }
};

const generateSearchQueries = async (text) => {
    const prompt = `
        Analyze the following journal entry to understand the user's core problem, emotion, or interest.
        Based on this, generate a JSON array of 3 unique, effective YouTube search queries that would find helpful videos (like tutorials, podcasts, or talks) to guide them.
        
        Example:
        Entry: "I want to become a successful cricketer but I am stuck at studies right now. Help me tackle the situation and overcome the negative thoughts."
        Response: ["cricket motivation for students", "how to balance studies and sports", "overcoming negative thoughts in sports psychology"]

        Entry: "${text}"
        Response:
    `;
    const responseJsonString = await primaryAIService.generateText(prompt);
    return JSON.parse(responseJsonString);
};


const searchYouTubeAndFetchStats = async (query) => {
    const searchResponse = await axios.get(YOUTUBE_SEARCH_URL, {
        params: {
            part: 'snippet',
            q: query,
            key: YOUTUBE_API_KEY,
            maxResults: 5,
            type: 'video',
        },
    });

    const videoItems = searchResponse.data.items;
    if (!videoItems || videoItems.length === 0) {
        return [];
    }
    
    const videoIds = videoItems.map(item => item.id.videoId).join(',');

    const statsResponse = await axios.get(YOUTUBE_VIDEOS_URL, {
        params: {
            part: 'snippet,statistics',
            id: videoIds,
            key: YOUTUBE_API_KEY,
        },
    });

    return statsResponse.data.items || [];
};


const rankAndSelectVideos = (videos, count) => {
    const uniqueVideos = [];
    const seenIds = new Set();

    for (const video of videos) {
        if (!seenIds.has(video.id)) {
            seenIds.add(video.id);

            const viewCount = parseInt(video.statistics.viewCount, 10) || 0;
            const likeCount = parseInt(video.statistics.likeCount, 10) || 0;

            const score = (viewCount * 0.6) + (likeCount * 0.4);

            uniqueVideos.push({
                videoId: video.id,
                title: video.snippet.title,
                description: video.snippet.description,
                score: score,
            });
        }
    }

    uniqueVideos.sort((a, b) => b.score - a.score);
    return uniqueVideos.slice(0, count);
};

module.exports = { findTopYouTubeVideos };