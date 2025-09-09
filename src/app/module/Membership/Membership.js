const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  dateOfPurchase: {
    type: Date,
  },
  websiteLink: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  accountNo: {
    type: String,
  },
  amountPaid: {
    type: Number,
  },
  membershipExpirationDate: {
    type: Date,
  },
  note: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);
module.exports = Membership;
