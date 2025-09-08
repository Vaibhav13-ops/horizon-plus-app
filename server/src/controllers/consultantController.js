const ConsultantProfile = require('../models/consultantProfile.js');
const User = require('../models/User.js');
const Booking = require('../models/Booking.js'); 
const Review = require('../models/Review.js'); 

const getMyProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    let profile = await ConsultantProfile.findOne({ user: req.user.id }).populate('user', ['username', 'email']);

    if (!profile) {
      profile = new ConsultantProfile({
        user: req.user.id,
        bio: 'Welcome to Horizon! Please update your bio.',
        expertise: ['General Advice'],
        ratePerSession: 0,
      });
      await profile.save();
      profile = await ConsultantProfile.findById(profile._id).populate('user', ['username', 'email']);
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const updateMyProfile = async (req, res) => {
  const { bio, expertise, ratePerSession } = req.body;

  try {
    let profile = await ConsultantProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    
    profile.bio = bio || profile.bio;
    profile.expertise = expertise || profile.expertise;
    profile.ratePerSession = ratePerSession || profile.ratePerSession;

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


const updateAvailability = async (req, res) => {
  const { availability } = req.body;

  try {
    const profile = await ConsultantProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.availability = availability;
    await profile.save();
    res.json(profile.availability);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


const getAllConsultants = async (req, res) => {
  try {  
    const profiles = await ConsultantProfile.find({}).populate('user', ['username']);

    const profilesWithReviews = await Promise.all(
      profiles.map(async (profile) => {
        const reviews = await Review.find({ consultant: profile.user._id });
        const numReviews = reviews.length;
        const avgRating = numReviews > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0;
        
        return {
          ...profile.toObject(),
          numReviews,
          avgRating: avgRating.toFixed(1)
        };
      })
    );
    
    res.json(profilesWithReviews);    
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


const getConsultantById = async (req, res) => {
  try {
        const profile = await ConsultantProfile.findOne({ user: req.params.id }).populate('user', ['username']);
        
        if (!profile) {
            return res.status(404).json({ message: 'Consultant not found' });
        }

        const reviews = await Review.find({ consultant: req.params.id });
        const numReviews = reviews.length;
        const avgRating = numReviews > 0 ? reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews : 0;
        
        res.json({
            ...profile.toObject(),
            numReviews,
            avgRating: avgRating.toFixed(1)
        });    

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ consultant: req.user.id })
      .populate('user', ['username']) 
      .sort({ createdAt: -1 }); 

    res.json(bookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { 
  getMyProfile, 
  updateMyProfile, 
  updateAvailability, 
  getAllConsultants,getConsultantById,getMyBookings
};