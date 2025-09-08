const JoyLogEntry = require('../models/JoyLogEntry.js');
const aiRecommendationService = require('../services/aiRecommendationService.js');

const getJoyLogEntries = async (req, res) => {
  const entries = await JoyLogEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(entries);
};

const addJoyLogEntry = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }
  const entry = new JoyLogEntry({
    user: req.user._id,
    content,
    recommendationsLoading: true,
  });
  const createdEntry = await entry.save();
  aiRecommendationService.findTopYouTubeVideos(createdEntry._id, content);
  res.status(201).json(createdEntry);
};


const updateJoyLogEntry = async (req, res) => {
    try {
        const { content } = req.body;
        const entry = await JoyLogEntry.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Log entry not found' });
        }
    
        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        entry.content = content || entry.content;
        const updatedEntry = await entry.save();
        res.json(updatedEntry);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const deleteJoyLogEntry = async (req, res) => {
    try {
        const entry = await JoyLogEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Log entry not found' });
        }

        if (entry.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await entry.deleteOne();
        res.json({ message: 'Log entry removed' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { 
    getJoyLogEntries, 
    addJoyLogEntry,
    updateJoyLogEntry, 
    deleteJoyLogEntry  
};
