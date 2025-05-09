const User = require('../models/user.model');

// Get current user's profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Update current user's profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    // Optionally, add validation for email/phone uniqueness here

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phoneNumber },
      { new: true, runValidators: true, context: 'query' }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

module.exports = { getProfile, updateProfile };