const mongoose = require('mongoose');
const journeyStepSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
    enum: ['WEBINAR', 'SESSION', 'AI_TASK', 'RESOURCE'], 
  },
  actionLink: {
    type: String,
  },
});

const journeySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    price: {
      type: Number,
      required: true,
    },
    durationWeeks: {
        type: Number,
        required: true,
    },
    steps: [journeyStepSchema],
    isPublished: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true }
);

const Journey = mongoose.model('Journey', journeySchema);
module.exports = Journey;
