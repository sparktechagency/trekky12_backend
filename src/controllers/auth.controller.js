const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/token-blacklist.model');
const { OAuth2Client } = require('google-auth-library');
const appleSignin = require('apple-signin-auth');
const { sendVerificationCode } = require('../services/email.service');


const register = async (req, res) => {
    try {
      const { name, email, phoneNumber, password, confirmPassword } = req.body;
  
      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Check if at least one of email or phoneNumber is provided
      if (!email && !phoneNumber) {
        return res.status(400).json({ message: 'Either email or phone number must be provided' });
      }
  
      // Check if email is already registered (if provided)
      if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ message: 'Email already registered' });
        }
      }

      // Check if phone number is already registered (if provided)
      if (phoneNumber) {
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
          return res.status(400).json({ message: 'Phone number already registered' });
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user with proper fields
      const userData = { 
        name, 
        password: hashedPassword,
        authProvider: 'local'
      };
      
      // Add email if provided
      if (email) {
        userData.email = email;
      }
      
      // Add phone number if provided
      if (phoneNumber) {
        userData.phoneNumber = phoneNumber;
      }
      
      const user = await User.create(userData);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};
  
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to handle Google authentication
const googleAuth = async (req, res) => {
  try {
    // This would typically redirect to Google OAuth consent screen
    // But for REST API we'll expect the Google ID token in the request
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }
    
    // Here you would verify the token with Google
    // This is simplified - you'll need to implement actual verification
    const googleUser = await verifyGoogleToken(idToken);
    
    if (!googleUser) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }
    
    // Find or create user
    let user = await User.findOne({ email: googleUser.email });
    
    if (!user) {
      // Create new user with Google info
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password
        googleId: googleUser.sub,
        authProvider: 'google'
      });
    } else if (!user.googleId) {
      // If user exists but hasn't connected Google, update their profile
      user.googleId = googleUser.sub;
      user.authProvider = user.authProvider || 'google';
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Google authentication failed', error: err.message });
  }
};

// Helper function to verify Google token (you'll need to implement this)
const verifyGoogleToken = async (idToken) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    console.error('Google token verification failed:', error);
    return null;
  }
};

// Function to handle the Google callback
const googleCallback = async (req, res) => {
  // This would be called after Google authentication
  // For a REST API this might not be needed if you're handling everything client-side
  res.status(501).json({ message: 'Not implemented yet' });
};

// Function to handle Apple authentication
const appleAuth = async (req, res) => {
  try {
    const { identityToken, user: appleUser } = req.body;
    
    if (!identityToken) {
      return res.status(400).json({ message: 'Apple identity token is required' });
    }
    
    // Verify Apple token
    // This is simplified - you'll need to implement actual verification
    const appleUserInfo = await verifyAppleToken(identityToken);
    
    if (!appleUserInfo) {
      return res.status(401).json({ message: 'Invalid Apple token' });
    }
    
    // Apple doesn't always provide email/name after the first sign-in
    // so we need to handle cases where this info is missing
    const email = appleUserInfo.email;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required from Apple authentication' });
    }
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user with Apple info
      user = await User.create({
        name: appleUser?.name || 'Apple User', // Apple may not always provide name
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10), // Random password
        appleId: appleUserInfo.sub,
        authProvider: 'apple'
      });
    } else if (!user.appleId) {
      // If user exists but hasn't connected Apple, update their profile
      user.appleId = appleUserInfo.sub;
      user.authProvider = user.authProvider || 'apple';
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Apple authentication failed', error: err.message });
  }
};

// Helper function to verify Apple token (you'll need to implement this)
const verifyAppleToken = async (identityToken) => {
  try {
    const appleUserInfo = await appleSignin.verifyIdToken(
      identityToken, 
      {
        audience: process.env.APPLE_CLIENT_ID,
        ignoreExpiration: false, // Do not accept expired tokens
      }
    );
    return appleUserInfo;
  } catch (error) {
    console.error('Apple token verification failed:', error);
    return null;
  }
};

// Function to handle the Apple callback
const appleCallback = async (req, res) => {
  // This would be called after Apple authentication
  // For a REST API this might not be needed if you're handling everything client-side
  res.status(501).json({ message: 'Not implemented yet' });
};

// Function to handle logout
const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }

    // Get the expiration time from the token
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Add the token to the blacklist with its expiration time
    const expiresAt = new Date(decoded.exp * 1000); // Convert from seconds to milliseconds
    
    await TokenBlacklist.create({
      token,
      expiresAt
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set verification code expiration (15 minutes)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save code to user document
    user.resetPasswordCode = {
      code: verificationCode,
      expiresAt
    };
    await user.save();

    const emailSent = await sendVerificationCode(email, verificationCode);
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send verification code' });
    }

    // TODO: Send email with verification code
    // You'll need to implement email sending functionality
    // For now, we'll just return the code in response (only for development)
    
    res.json({ 
      message: 'Verification code sent to your email',
      code: verificationCode // Remove this in production
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process request', error: err.message });
  }
};

const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetPasswordCode || !user.resetPasswordCode.code) {
      return res.status(400).json({ message: 'No reset code requested' });
    }

    if (new Date() > user.resetPasswordCode.expiresAt) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    if (user.resetPasswordCode.code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Generate a temporary token for password reset
    const resetToken = jwt.sign(
      { userId: user._id, purpose: 'reset-password' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ 
      message: 'Code verified successfully',
      resetToken 
    });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const resetToken = req.headers.authorization?.split(' ')[1];

    if (!resetToken) {
      return res.status(400).json({ message: 'Reset token is required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Verify reset token
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    if (decoded.purpose !== 'reset-password') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    
    // Clear reset code
    user.resetPasswordCode = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

module.exports = { register, login, googleAuth, appleAuth, googleCallback, appleCallback, logout, forgotPassword, verifyResetCode, resetPassword };