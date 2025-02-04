const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // This should be an App Password
  },
  tls: {
    rejectUnauthorized: false // For development
  }
});

// Verify transporter
transporter.verify(function(error, success) {
  if (error) {
    console.log("Email service error:", error);
  } else {
    console.log("Email server is ready");
  }
});

const sendFeedbackEmail = async (feedback) => {
  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6B21A8; border-bottom: 2px solid #6B21A8; padding-bottom: 10px;">New Feedback Received</h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #4B5563;">Sender Information:</strong>
            <ul style="list-style: none; padding-left: 0;">
              <li style="margin: 5px 0;"><strong>Name:</strong> ${feedback.name}</li>
              <li style="margin: 5px 0;"><strong>Email:</strong> ${feedback.email}</li>
              <li style="margin: 5px 0;"><strong>Company:</strong> ${feedback.company}</li>
              <li style="margin: 5px 0;"><strong>Subject:</strong> ${feedback.subject}</li>
            </ul>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #4B5563;">Message:</strong>
            <p style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 5px;">
              ${feedback.message}
            </p>
          </div>

          <div style="margin-top: 20px; font-size: 0.9em; color: #6B7280;">
            <p>Received at: ${new Date().toLocaleString()}</p>
          </div>
        </div>

        <div style="font-size: 0.8em; color: #6B7280; margin-top: 20px; text-align: center;">
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ['shovonislam493@gmail.com', feedback.email],
      subject: `New Feedback: ${feedback.subject}`,
      html: emailContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendFeedbackEmail };
