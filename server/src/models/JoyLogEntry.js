const mongoose = require('mongoose');
const aiRecommendationSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
});

const joyLogEntrySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    recommendationsLoading: {
      type: Boolean,
      default: false,
    },
    aiRecommendations: [aiRecommendationSchema],    
  },
  {
    timestamps: true,
  }
);

const JoyLogEntry = mongoose.model('JoyLogEntry', joyLogEntrySchema);
module.exports = JoyLogEntry;
