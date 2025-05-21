const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use app-specific password for Gmail
  }
});

const sendVerificationCode = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Verification Code',
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Here is your verification code:</p>
        <h2 style="color: #4CAF50; font-size: 24px; letter-spacing: 2px;">${code}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendVerificationCode };