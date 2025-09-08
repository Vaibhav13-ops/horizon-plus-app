const Journey = require('../models/Journey.js');
const UserJourney = require('../models/UserJourney.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const isConsultant = (req, res, next) => {
  if (req.user && req.user.role === 'consultant') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Not a consultant.' });
  }
};


const createJourney = async (req, res) => {
    try {
        const { title, description, price, durationWeeks, steps } = req.body;

        const journey = new Journey({
            title,
            description,
            price,
            durationWeeks,
            steps,
            consultant: req.user._id, // Link to the logged-in consultant
        });

        const createdJourney = await journey.save();
        res.status(201).json(createdJourney);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getMyJourneys = async (req, res) => {
    try {
        const journeys = await Journey.find({ consultant: req.user._id });
        res.json(journeys);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getAllPublishedJourneys = async (req, res) => {
    try {
        const journeys = await Journey.find({ isPublished: true }).populate('consultant', 'username');
        res.json(journeys);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const updateJourney = async (req, res) => {
    try {
        const journey = await Journey.findById(req.params.id);

        if (journey) {
            if (journey.consultant.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to edit this journey' });
            }

            journey.title = req.body.title || journey.title;
            journey.description = req.body.description || journey.description;
            journey.price = req.body.price || journey.price;
            journey.durationWeeks = req.body.durationWeeks || journey.durationWeeks;
            journey.steps = req.body.steps || journey.steps;
            journey.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : journey.isPublished;

            const updatedJourney = await journey.save();
            res.json(updatedJourney);
        } else {
            res.status(404).json({ message: 'Journey not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



const enrollInJourney = async (req, res) => {
    const { paymentIntentId, journeyId } = req.body;
    const userId = req.user._id;

    try {
        const existingEnrollment = await UserJourney.findOne({ user: userId, journey: journeyId });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'You are already enrolled in this journey.' });
        }
        
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: 'Payment not successful.' });
        }
        
        if (paymentIntent.metadata.journeyId !== journeyId || paymentIntent.metadata.userId !== userId.toString()) {
            return res.status(400).json({ message: 'Payment metadata mismatch.' });
        }
        
        const userJourney = new UserJourney({
            user: userId,
            journey: journeyId,
        });

        await userJourney.save();
        res.status(201).json({ message: 'Successfully enrolled in journey!', userJourney });

    } catch (error) {
        console.error("Error enrolling in journey:", error);
        res.status(500).json({ message: 'Server error while enrolling in journey.' });
    }
};


const getJourneyById = async (req, res) => {
    try {
        const journey = await Journey.findById(req.params.id).populate('consultant', 'username');
        if (journey) {
            res.json(journey);
        } else {
            res.status(404).json({ message: 'Journey not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await UserJourney.find({ user: req.user._id })
            .populate({
                path: 'journey',
                populate: {
                    path: 'consultant',
                    select: 'username'
                }
            });
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getEnrollmentStatus = async (req, res) => {
    try {
        const { id: journeyId } = req.params;
        const userId = req.user._id;
        
        const enrollment = await UserJourney.findOne({ 
            user: userId, 
            journey: journeyId 
        });
        
        res.json({ 
            isEnrolled: !!enrollment,
            enrollment: enrollment || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createJourney,
    getMyJourneys,
    getAllPublishedJourneys,
    updateJourney,
    isConsultant,
    enrollInJourney,
    getJourneyById,
    getMyEnrollments,
    getEnrollmentStatus
};