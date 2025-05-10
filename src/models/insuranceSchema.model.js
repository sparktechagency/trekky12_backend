const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  datePurchased: { type: Date, required: true },
  policyExpiration: { type: Date, required: true },
  annualAmount: { type: Number, required: true },
  policyNumber: { type: String, required: true },
  phoneNumber: { type: String },
  website: { type: String },
  notes: { type: String },
  documents: [{ type: String }], // file paths or URLs
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Insurance', InsuranceSchema);
