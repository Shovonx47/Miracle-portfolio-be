const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: true, // use pooled connections
      maxConnections: 3, // limit concurrent connections
      maxMessages: Infinity,
      rateDelta: 1000, // wait 1 second between messages
      rateLimit: 3 // limit to 3 messages per rateDelta
    });
  }
  return transporter;
};

const getEmailContent = (feedback) => `
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

const sendFeedbackEmail = async (feedback) => {
  try {
    // Get or create transporter
    const transport = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: ['shovonislam493@gmail.com', feedback.email],
      subject: `New Feedback: ${feedback.subject}`,
      html: getEmailContent(feedback)
    };

    // Set a timeout for the email sending operation
    const emailPromise = transport.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email timeout')), 8000)
    );

    // Race between email sending and timeout
    const info = await Promise.race([emailPromise, timeoutPromise]);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendFeedbackEmail };
