const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  renewalDate: {
    type: Date,
  },
  expirationDate: {
    type: Date,
  },
  membershipExpiration: { // dynamically extended expiration date
    type: Date,
  },
  cost: {
    type: Number,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  membershipNumber: {
    type: String,
  },
  notes: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  history: [
    {
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      cost: Number,
      renewalDate: Date,
      expirationDate: Date,
    }
  ]
}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);
module.exports = Membership;
