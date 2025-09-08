const { getCoachingResponseFromAI } = require('../services/aiService.js');

const getCoachingResponse = async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message cannot be empty' });
  }

  try {
    const aiAnalysis = await getCoachingResponseFromAI(message, history);
    
    res.json(aiAnalysis);
  } catch (error) {
    console.error('AI Coach error:', error);
    res.status(500).json({ message: 'The AI coach is taking a break, please try again later.' });
  }
};

module.exports = { getCoachingResponse };
