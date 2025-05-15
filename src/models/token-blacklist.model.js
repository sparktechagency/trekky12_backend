const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // This will automatically remove the document when expiresAt is reached
  }
}, { timestamps: true });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema); 