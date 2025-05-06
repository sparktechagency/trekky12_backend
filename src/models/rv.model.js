const mongoose = require('mongoose');

const rvSchema = new mongoose.Schema({
  type: { type: String, required: true },
  manufacturer: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true },
  nickname: { type: String , required: true},
  datePurchased: { type: Date , required: true},
  amountPaid: { type: Number, required: true },
  purchasedFrom: { type: String, required: true },
  city: { type: String , required: true},
  state: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  website: { type: String },
  documents: [{ type: String }], // URLs or file paths
  notes: { type: String },
  model: { type: String },
  name: { type: String },
  floorplan: { type: String },
  length: { type: Number },
  width: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  interiorColorScheme: { type: String },
  exteriorColorScheme: { type: String },
  class: {
    type: String,
    enum: [
      'Class A',
      'Class B',
      'Class C',
      'Pop-up',
      'Super C',
      'Travel Trailer',
      '5th wheel',
      'Other'
    ],
    required: true
  },
  vin: { type: String },
  serialId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('RV', rvSchema);
