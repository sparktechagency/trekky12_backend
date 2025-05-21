const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: function() {
      return !this.phoneNumber; // Email is required only if phoneNumber is not provided
    },
    unique: true,
    sparse: true // This allows null/undefined values while maintaining uniqueness
  },
  phoneNumber: {
    type: String,
    required: function() {
      return !this.email; // Phone number is required only if email is not provided
    },
    unique: true,
    sparse: true
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  notificationPrefs: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  pushToken: { type: String },
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Add a validation to ensure at least one of email or phoneNumber is provided
userSchema.pre('validate', function(next) {
  if (!this.email && !this.phoneNumber) {
    this.invalidate('email', 'Either email or phone number must be provided');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);