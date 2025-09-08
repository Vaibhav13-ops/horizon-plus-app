const express = require('express');
const router = express.Router();
const {
  getVisionItems,
  addVisionItem,
  deleteVisionItem,
  getItemDetails,
  regenerateAISuggestions
} = require('../controllers/visionBoardController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').get(protect, getVisionItems).post(protect, addVisionItem);
router.route('/:id').delete(protect, deleteVisionItem).get(protect, getItemDetails);
router.route('/:id/regenerate').post(protect, regenerateAISuggestions);

module.exports = router;