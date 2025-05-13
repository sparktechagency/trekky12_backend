const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  datePurchased: { type: Date, required: true },
  membershipExpiration: { type: Date, required: true },
  amountPaid: { type: Number, required: true },
  accountNumber: { type: String },
  phoneNumber: { type: String },
  website: { type: String },
  docsOrPictures: [{ type: String }], // URLs or file paths
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);
