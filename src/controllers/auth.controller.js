const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      const user = await User.create({ 
        name, 
        email, 
        phoneNumber,
        password: hashedPassword 
      });
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
};
  
const login = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    // Check if at least one of email or phoneNumber is provided
    if (!email && !phoneNumber) {
      return res.status(400).json({ message: 'Either email or phone number must be provided' });
    }

    // Find user by email or phone number
    const user = await User.findOne({
      $or: [
        { email: email || null },
        { phoneNumber: phoneNumber || null }
      ]
    });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

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
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

module.exports = { register, login };