const nodemailer = require('nodemailer');

const sendResetCode = async (email, code) => {
  try {
    // Create Ethereal test account automatically
    const testAccount = await nodemailer.createTestAccount();

    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      },
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates for testing
      }
    });

    const mailOptions = {
      from: `"Test Server" <${testAccount.user}>`,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`,
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested to reset your password. Here is your verification code:</p>
        <h2 style="color: #4CAF50; font-size: 24px; letter-spacing: 2px;">${code}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log preview URL for testing (only in development)
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendResetCode };