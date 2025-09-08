const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ConsultantProfile = require('../models/ConsultantProfile.js');
const Journey = require('../models/Journey.js');
const UserJourney = require('../models/UserJourney.js'); 

const createPaymentIntent = async (req, res) => {
  const { consultantId, timeSlot } = req.body;
  try {
    const profile = await ConsultantProfile.findOne({ user: consultantId });
    if (!profile || !profile.ratePerSession) {
      return res.status(404).json({ message: 'Consultant or rate not found.' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: profile.ratePerSession * 100,
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
      metadata: {
        consultantId: consultantId,
        userId: req.user.id,
        timeSlot: timeSlot,
      }
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: 'Failed to create payment intent.' });
  }
};


const createJourneyPaymentIntent = async (req, res) => {
    const { journeyId } = req.body;

    try {
        const existingEnrollment = await UserJourney.findOne({ 
            user: req.user.id, 
            journey: journeyId 
        });
        
        if (existingEnrollment) {
            return res.status(400).json({ 
                message: 'You are already enrolled in this journey. Please check your enrolled journeys.' 
            });
        }    
        
        
        const journey = await Journey.findById(journeyId);
        if (!journey || !journey.price) {
            return res.status(404).json({ message: 'Journey or price not found.' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: journey.price * 100, 
            currency: 'inr',
            automatic_payment_methods: { enabled: true },
            metadata: {
                journeyId: journeyId,
                userId: req.user.id,
            }
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Error creating journey payment:", error);
        res.status(500).json({ message: 'Failed to create journey payment intent.' });
    }
};


module.exports = { createPaymentIntent, createJourneyPaymentIntent };
