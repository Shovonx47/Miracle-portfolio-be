const Feedback = require('../models/Feedback');
const { sendFeedbackEmail } = require('../utils/emailService');

exports.sendFeedback = async (req, res) => {
  try {
    console.log('Received feedback:', req.body);
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !company || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      name,
      email,
      company,
      subject,
      message
    });

    // Send email notification
    const emailSent = await sendFeedbackEmail(feedback);
    console.log('Email sending status:', emailSent);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      emailSent,
      feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      feedbacks
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedbacks',
      error: error.message
    });
  }
};
