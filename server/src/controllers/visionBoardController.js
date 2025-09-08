const VisionItem = require('../models/VisionItem.js');
const aiService = require('../services/visionAiService.js');

const getVisionItems = async (req, res) => {
  try {
    const items = await VisionItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vision items', error: error.message });
  }
};

const addVisionItem = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Please provide a title and an image URL' });
    }

    const item = new VisionItem({
      user: req.user._id,
      title,
      imageUrl,
      suggestionsLoading: true
    });

    const createdItem = await item.save();

    generateAISuggestionsAsync(createdItem._id, title, imageUrl);

    res.status(201).json(createdItem);

  } catch (error) {
    res.status(500).json({ message: 'Error creating vision item', error: error.message });
  }
};


const generateAISuggestionsAsync = async (itemId, title, imageUrl) => {
  try {
    console.log(`Generating AI suggestions for item: ${itemId}`);
    
    const [suggestionsResult, quickTip] = await Promise.all([
      aiService.generateSuggestions(title, imageUrl),
      aiService.generateQuickTip(title, imageUrl)
    ]);

    const updateData = {
      suggestionsLoading: false,
      quickTip
    };

    if (suggestionsResult.success) {
      updateData.aiSuggestions = {
        ...suggestionsResult.data,
        generatedAt: new Date()
      };
    } else {
      console.error('AI Suggestions Error:', suggestionsResult.error);
      updateData.aiSuggestions = {
        youtubeVideos: [],
        guidanceSlips: [{
          title: "Get Started Today",
          content: "Take the first step towards your goal. Break it down into smaller, manageable tasks.",
          actionSteps: ["Define your specific goal", "Create a timeline", "Take one action today"]
        }],
        uniqueIdeas: [{
          title: "Visualization Exercise",
          description: "Spend 5 minutes daily visualizing yourself achieving this goal",
          implementation: "Set a daily reminder and find a quiet space for visualization"
        }],
        motivationalQuote: "The journey of a thousand miles begins with one step.",
        nextSteps: ["Research your goal", "Find a mentor or community", "Create an action plan"],
        generatedAt: new Date()
      };
    }

    await VisionItem.findByIdAndUpdate(itemId, updateData);
    console.log(`AI suggestions generated successfully for item: ${itemId}`);

  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    
    await VisionItem.findByIdAndUpdate(itemId, {
      suggestionsLoading: false,
      quickTip: "Stay focused on your goal and take consistent action!"
    });
  }
};

const deleteVisionItem = async (req, res) => {
  try {
    const item = await VisionItem.findById(req.params.id);

    if (item && item.user.toString() === req.user._id.toString()) {
      await item.deleteOne();
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found or user not authorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vision item', error: error.message });
  }
};


const getItemDetails = async (req, res) => {
  try {
    const item = await VisionItem.findById(req.params.id);

    if (!item || item.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Item not found or user not authorized' });
    }

    res.json(item);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching item details', error: error.message });
  }
};

const regenerateAISuggestions = async (req, res) => {
  try {
    const item = await VisionItem.findById(req.params.id);

    if (!item || item.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Item not found or user not authorized' });
    }


    if (!item.imageUrl) {
      console.error(`Attempted to regenerate suggestions for item ${item._id} which has no imageUrl.`);
      return res.status(400).json({ message: 'Cannot generate suggestions. This goal is missing an image URL.' });
    }  

    item.suggestionsLoading = true;
    await item.save();

    generateAISuggestionsAsync(item._id, item.title, item.imageUrl);

    res.json({ message: 'Regenerating AI suggestions...' });

  } catch (error) {
    res.status(500).json({ message: 'Error regenerating suggestions', error: error.message });
  }
};

module.exports = { 
  getVisionItems, 
  addVisionItem, 
  deleteVisionItem,
  getItemDetails,
  regenerateAISuggestions
};