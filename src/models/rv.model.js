const mongoose = require('mongoose');

const rvSchema = new mongoose.Schema({
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  nickname: { type: String },
  datePurchased: { type: Date },
  amountPaid: { type: Number },
  purchasedFrom: { type: String },
  city: { type: String },
  state: { type: String },
  phoneNumber: { type: String },
  website: { type: String },
  documents: [{ type: String }], // URLs or file paths
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RV', rvSchema);
