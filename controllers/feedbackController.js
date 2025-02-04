const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} catch (error) {
  console.error('Error creating transporter:', error);
}

exports.sendFeedback = async (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    if (!name || !email || !company || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Save feedback to database without waiting
    const feedback = new Feedback({
      name,
      email,
      company,
      subject,
      message
    });
    
    // Send response immediately after validation
    res.status(200).json({ 
      success: true, 
      message: 'Feedback received successfully' 
    });

    // Handle database save and email sending after response
    try {
      await feedback.save();
      console.log('Feedback saved to database');

      if (transporter) {
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

        // Send email without waiting
        transporter.sendMail(mailOptions)
          .then(() => console.log('Email sent successfully'))
          .catch(error => console.error('Error sending email:', error));
      }
    } catch (error) {
      console.error('Error in background operations:', error);
    }
  } catch (error) {
    console.error('Error in feedback handler:', error);
    // Only send error response if we haven't sent success response
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'Error processing feedback' 
      });
    }
  }
};
