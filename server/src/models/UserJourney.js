const mongoose = require('mongoose');

const userJourneySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  journey: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Journey',
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED'],
    default: 'IN_PROGRESS',
  },
  completedSteps: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journey.steps', 
    },
  ],
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

const UserJourney = mongoose.model('UserJourney', userJourneySchema);
module.exports = UserJourney;
