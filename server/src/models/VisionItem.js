const mongoose = require('mongoose');

const visionItemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    aiSuggestions: {
      youtubeVideos: [{
        title: String,
        searchQuery: String,
        description: String,
        channel: String
      }],
      guidanceSlips: [{
        title: String,
        content: String,
        actionSteps: [String]
      }],
      uniqueIdeas: [{
        title: String,
        description: String,
        implementation: String,
        tools: [String]
      }],
      motivationalQuote: String,
      nextSteps: [String],
      skillAssessment: {
        beginner: [String],
        intermediate: [String],
        advanced: [String]
      },
      communities: [{
        name: String,
        platform: String,
        description: String
      }],
      fieldResources: {
        topChannels: [String],
        mustReadBooks: [String],
        essentialTools: [String],
        learningPaths: [String],
        practiceProjects: [String]
      },
      generatedAt: {
        type: Date,
        default: Date.now
      }
    },
    quickTip: {
      type: String,
      default: ''
    },
    suggestionsLoading: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const VisionItem = mongoose.model('VisionItem', visionItemSchema);
module.exports = VisionItem;

