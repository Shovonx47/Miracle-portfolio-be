const express = require('express');
const router = express.Router();
const { sendFeedback, getFeedbacks } = require('../controllers/feedbackController');

router.post('/send', sendFeedback);
router.get('/', getFeedbacks);

module.exports = router;
