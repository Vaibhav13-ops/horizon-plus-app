const mongoose = require('mongoose');

const consultantProfileSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true, 
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxlength: [500, 'Bio cannot be more than 500 characters'],
  },
  expertise: {
    type: [String], 
    required: [true, 'Please add at least one area of expertise'],
  },
  ratePerSession: {
    type: Number,
    required: [true, 'Please set your rate per session'],
  },
  availability: [
    {
      day: { type: String, required: true }, 
      slots: [{ type: String, required: true }],
    },
  ],
});

const ConsultantProfile = mongoose.model('ConsultantProfile', consultantProfileSchema);
module.exports = ConsultantProfile;
