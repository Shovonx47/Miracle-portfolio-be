const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendFeedback = async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !company || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Save feedback to database
    const feedback = new Feedback({
      name,
      email,
      company,
      subject,
      message
    });
    
    await feedback.save();
    console.log('Feedback saved to database');

    // Configure email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'shovonislam493@gmail.com',
      subject: `New Feedback: ${subject}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Feedback Sent From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({ 
      success: true, 
      message: 'Feedback sent successfully',
      feedbackId: feedback._id
    });

  } catch (error) {
    console.error('Error in sendFeedback:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending feedback',
      error: error.message 
    });
  }
};
