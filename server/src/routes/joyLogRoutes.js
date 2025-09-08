const express = require('express');
const router = express.Router();
const { 
    getJoyLogEntries, 
    addJoyLogEntry,
    updateJoyLogEntry,
    deleteJoyLogEntry 
} = require('../controllers/joyLogController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').get(protect, getJoyLogEntries).post(protect, addJoyLogEntry);

router.route('/:id').put(protect, updateJoyLogEntry).delete(protect, deleteJoyLogEntry);
module.exports = router;