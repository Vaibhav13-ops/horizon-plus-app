const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Using gemini-1.5-flash-latest as you specified
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
  }

  async generateSuggestions(title, imageUrl) {
  try {
    // First, analyze the image to understand the content
    const imageAnalysis = await this.analyzeImage(imageUrl);
    
    const prompt = `
      I'm analyzing a vision board item with the title: "${title}"
      Image analysis: ${imageAnalysis}

      Based on BOTH the title AND the specific image content, provide highly targeted, specific suggestions in JSON format:
      {
        "youtubeVideos": [
          {
            "title": "Specific video title related to this exact field/skill",
            "searchQuery": "very specific search terms for this domain",
            "description": "Why this specific video helps with this particular goal",
            "channel": "Recommended channel name if known"
          }
        ],
        "guidanceSlips": [
          {
            "title": "Domain-specific guidance title",
            "content": "Detailed, field-specific guidance content with actionable advice",
            "actionSteps": ["very specific step 1", "specific step 2", "specific step 3"]
          }
        ],
        "uniqueIdeas": [
          {
            "title": "Creative idea specific to this field",
            "description": "Detailed description tailored to this exact domain/skill",
            "implementation": "Step-by-step implementation specific to this field",
            "tools": ["specific tools/resources needed"]
          }
        ],
        "motivationalQuote": "A quote specifically relevant to this field/goal",
        "nextSteps": ["immediate specific action 1", "domain-specific action 2", "field-relevant action 3"],
        "skillAssessment": {
          "beginner": ["specific beginner tips"],
          "intermediate": ["intermediate level advice"],
          "advanced": ["advanced strategies"]
        },
        "communities": [
          {
            "name": "Specific community/forum name",
            "platform": "Reddit/Discord/LinkedIn etc",
            "description": "Why this community is valuable for this goal"
          }
        ],
        "fieldResources": {
          "topChannels": ["specific YouTube channel names for this exact field"],
          "mustReadBooks": ["specific book titles for this domain"],
          "essentialTools": ["specific tools/software used in this field"],
          "learningPaths": ["structured learning sequence for this skill"],
          "practiceProjects": ["specific projects to build skills in this area"]
        }
      }

      IMPORTANT GUIDELINES:
      - If this is about SOFTWARE ENGINEERING: suggest specific programming languages, frameworks, coding channels like Traversy Media, freeCodeCamp, specific GitHub projects
      - If this is about SPORTS/FITNESS: suggest specific training routines, sports-specific channels, equipment, techniques
      - If this is about BUSINESS: suggest specific business models, marketing strategies, entrepreneur channels
      - If this is about CREATIVE ARTS: suggest specific techniques, art channels, tools, software
      - If this is about ACADEMICS: suggest specific courses, academic channels, study methods
      - Be as SPECIFIC as possible - mention exact channel names, specific techniques, particular tools
      - Provide 2-3 items for each array INCLUDING fieldResources arrays
      - Make every suggestion actionable and domain-specific
      - Don't give generic advice - tailor everything to the exact field shown in the image
      - ENSURE fieldResources has actual data, not empty arrays
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        
        if (!suggestions.fieldResources || 
            (suggestions.fieldResources.topChannels?.length === 0 && 
             suggestions.fieldResources.essentialTools?.length === 0 && 
             suggestions.fieldResources.practiceProjects?.length === 0)) {
          
          console.log('fieldResources empty, generating fallback...');
          const fieldResourcesData = await this.getFieldSpecificResources(title, imageUrl);
          if (fieldResourcesData) {
            suggestions.fieldResources = fieldResourcesData;
          }
        }
        
        return { success: true, data: suggestions };
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Parse Error:', parseError);
      return { success: false, error: 'Failed to parse AI response', rawResponse: text };
    }

  } catch (error) {
    console.error('AI Service Error:', error);
    return { success: false, error: error.message };
  }
}

  async analyzeImage(imageUrl) {
    try {

      if (!imageUrl) {
         console.warn('No image URL provided for analysis');
         return 'No image provided for analysis. Suggestions will be based on title only.';
      }       
      const prompt = `
        Analyze this image in detail and identify:
        1. What specific field, skill, or domain is this related to? (e.g., software development, cricket, business, art, fitness, etc.)
        2. What specific elements can you see? (tools, equipment, symbols, text, people, activities)
        3. What level or type of activity does this represent? (beginner, professional, specific sport, programming language, business type, etc.)
        4. Any text or brands visible in the image?
        5. What specific goal or aspiration does this image represent?

        Be very specific and detailed. This analysis will be used to provide targeted suggestions.
      `;

      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageResponse.headers.get('content-type') || 'image/jpeg'
          }
        }
      ]);

      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Image Analysis Error:', error);
      return `Based on the title, this appears to be related to the general domain mentioned in the title. Image analysis was not available.`;
    }
  }

  async generateQuickTip(title, imageUrl) {
    try {
      const imageAnalysis = await this.analyzeImage(imageUrl);
      
      const prompt = `
        Based on the title "${title}" and image analysis: "${imageAnalysis}"
        
        Provide ONE very specific, actionable tip for someone in this exact field/domain.
        Make it highly targeted to the specific skill or area shown in the image.
        Keep it under 80 words and make it immediately actionable.
        
        Examples of specific tips:
        - For coding: "Start with JavaScript ES6 features - focus on arrow functions and destructuring first"
        - For cricket: "Practice your front foot defense for 15 minutes daily against a tennis ball"
        - For business: "Create a simple landing page using Carrd and test your business idea with 10 potential customers"
        
        Return only the tip text, no additional formatting.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();

    } catch (error) {
      console.error('Quick Tip Error:', error);
      return "Focus on consistent daily practice and seek specific feedback to improve rapidly!";
    }
  }

  async getFieldSpecificResources(title, imageUrl) {
    try {
      const imageAnalysis = await this.analyzeImage(imageUrl);
      
      const prompt = `
        Based on "${title}" and image: "${imageAnalysis}"
        
        Provide a JSON response with field-specific resources:
        {
          "topChannels": ["specific YouTube channel names for this exact field"],
          "mustReadBooks": ["specific book titles for this domain"],
          "essentialTools": ["specific tools/software used in this field"],
          "learningPaths": ["structured learning sequence for this skill"],
          "practiceProjects": ["specific projects to build skills in this area"]
        }
        
        Be extremely specific to the field identified in the image.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Failed to parse field resources:', e);
      }
      
      return null;
    } catch (error) {
      console.error('Field Resources Error:', error);
      return null;
    }
  }
}

module.exports = new AIService();