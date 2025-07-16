const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  insuranceCompany: {
    type: String,
  },
  websiteLink: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  effectiveDate: {
    type: Date,
  },
  renewalDate: {
    type: Date,
  },
  expirationDate: {
    type: Date,
  },
  cost: {
    type: Number,
  },
  policyNumber: {
    type: String,
  },
  images: {
    type: [String],
    default: [],
  },
  notes: {
    type: String,
    default: '',
  }
}, { timestamps: true });

const Insurance = mongoose.model('Insurance', insuranceSchema);

module.exports = Insurance;
