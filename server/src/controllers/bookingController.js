const Booking = require('../models/Booking.js');
const User = require('../models/User.js');
const ConsultantProfile = require('../models/ConsultantProfile.js');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const finalizeBooking = async (req, res) => {
  const { paymentIntentId, consultantId, timeSlot } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful.' });
    }


    const existingBooking = await Booking.findOne({ 'payment.paymentId': paymentIntentId });

    if (existingBooking) {
      console.log('Duplicate booking finalization attempt ignored for PaymentIntent:', paymentIntentId);
      return res.status(200).json({ message: 'Booking already finalized.' });
    }
    
    const videoCallLink = `https://meet.jit.si/HorizonPlus-${uuidv4()}`;

   
    const booking = new Booking({
      user: req.user.id, 
      consultant: consultantId,
      timeSlot: timeSlot,
      videoCallLink: videoCallLink,
      payment: {
        paymentId: paymentIntent.id,
      }
    });
    await booking.save();

    
    const consultantProfile = await ConsultantProfile.findOne({ user: consultantId });
    if (consultantProfile) {
      const [day, time] = timeSlot.split(' ');
      const daySchedule = consultantProfile.availability.find(d => d.day === day);
      if (daySchedule) {
        daySchedule.slots = daySchedule.slots.filter(slot => slot !== time);
        await consultantProfile.save();
      }
    }

    
    const user = await User.findById(req.user.id);
    const consultant = await User.findById(consultantId);

    if (user && consultant) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Your Horizon+ Session is Confirmed!',
            html: `
            <h1>Booking Confirmed!</h1>
            <p>Hi ${user.username},</p>
            <p>Your session with ${consultant.username} is confirmed for ${timeSlot}.</p>
            <p>Your unique video call link is: <a href="${videoCallLink}">${videoCallLink}</a></p>
            <p>We look forward to seeing you!</p>
            `,
        });
    }
    
    res.status(201).json({ message: 'Booking finalized successfully.' });

  } catch (error) {
    console.error("Error finalizing booking:", error);
    res.status(500).json({ message: 'Server error while finalizing booking.' });
  }
};


module.exports = { finalizeBooking};