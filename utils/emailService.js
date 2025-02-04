const nodemailer = require('nodemailer');

const sendFeedbackEmail = async (feedback) => {
  console.log('Starting email send process...');

  try {
    // Create a test account if no email credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('No email credentials found, creating test account...');
      const testAccount = await nodemailer.createTestAccount();
      process.env.EMAIL_USER = testAccount.user;
      process.env.EMAIL_PASS = testAccount.pass;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('Created transporter with email:', process.env.EMAIL_USER);

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'shovonislam493@gmail.com',
      subject: `New Contact Form Submission from ${feedback.name}`,
      text: `
Name: ${feedback.name}
Email: ${feedback.email}
Company: ${feedback.company}
Subject: ${feedback.subject}
Message: ${feedback.message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${feedback.name}</p>
        <p><strong>Email:</strong> ${feedback.email}</p>
        <p><strong>Company:</strong> ${feedback.company}</p>
        <p><strong>Subject:</strong> ${feedback.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${feedback.message}</p>
      `
    };

    console.log('Attempting to send email to:', mailOptions.to);

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    // Log ethereal URL if using test account
    if (info.messageUrl) {
      console.log('Preview URL:', info.messageUrl);
    }

    return true;
  } catch (error) {
    console.error('Email Error Details:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return false;
  }
};

module.exports = { sendFeedbackEmail };
