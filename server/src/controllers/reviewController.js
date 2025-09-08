const Review = require('../models/Review.js');

const getReviewsForConsultant = async (req, res) => {
  try {
    const reviews = await Review.find({ consultant: req.params.consultantId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const createReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    
    const review = new Review({
      consultant: req.params.consultantId,
      user: req.user._id,
      username: req.user.username,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};


const updateReview = async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;

        await review.save();
        res.json(review);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await review.deleteOne();
        res.json({ message: 'Review removed' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = { getReviewsForConsultant, createReview, updateReview, deleteReview };
