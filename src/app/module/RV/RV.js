const mongoose = require('mongoose');

const rvSchema = new mongoose.Schema({
  // Identification
  nickname: {
    type: String,
    required: true
  },
  rvClass: String,
  manufacturer: {
    type: String,
    required: true
  },
  modelName: {
    type: String,
    required: true
  },
  modelNumber: {
    type: String,
    required: true
  },
  modelYear: {
    type: Number,
    required: true
  },
  
  // Purchase Details
  dateOfPurchase: Date,
  amountPaid: Number,
  newOrUsed: {
    type: String,
    enum: ['New', 'Used']
  },
  purchasedFrom: String,
  currentMileage: Number,
  
  // Contact Info
  city: String,
  state: String,
  phoneNumber: String,
  
  // Specifications
  floorplan: String,
  interiorColorScheme: String,
  exteriorColorScheme: String,
  length: Number,    // in feet
  width: Number,     // in feet
  height: Number,    // in feet
  weight: Number,    // in lbs
  

  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RV = mongoose.model('RV', rvSchema);
module.exports = RV;