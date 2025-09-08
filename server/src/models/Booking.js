const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    consultant: { 
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    timeSlot: {
      type: String, 
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
    },
    videoCallLink: {
      type: String,
      required: true,
    },
    payment: {
      paymentId: String,
    },    
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
