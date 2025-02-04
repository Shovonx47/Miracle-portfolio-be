const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Create transporter with simple configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logging
    logger: true  // Log to console
  });

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
  console.log('Starting email send process...');
  console.log('Email configuration:', {
    user: process.env.EMAIL_USER ? 'Set' : 'Not set',
    pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
  });

  try {
    const transport = createTransporter();
    
    // Test connection first
    await transport.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: {
        name: 'Miracle Portfolio',
        address: process.env.EMAIL_USER
      },
      to: 'shovonislam493@gmail.com', // Send only to your email for now
      subject: `New Feedback: ${feedback.subject}`,
      html: getEmailContent(feedback)
    };

    console.log('Attempting to send email with options:', {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject
    });

    const info = await transport.sendMail(mailOptions);
    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    return true;
  } catch (error) {
    console.error('Detailed email error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    return false;
  }
};

module.exports = { sendFeedbackEmail };
