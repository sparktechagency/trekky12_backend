const mongoose = require('mongoose');

const rvSchema = new mongoose.Schema({
<<<<<<< HEAD
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
=======
    nickname: {
        type: String,
    },
    class: {
        type: String,
    },
    manufacturer: {
        type: String,
    },
    modelName: {
        type: String,
    },
    modelNumber: {
        type: String,
    },
    dateOfPurchase: {
        type: Date,
    },
    amountPaid: {
        type: Number,
    },
    newOrUsed: {
        type: String,
    },
    currentMileage: {
        type: Number,
    },
    purchasedFrom: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },  
    phoneNumber: {
        type: String,
    },
    floorplan: {
        type: String,
    },
    interiorColorScheme: {
        type: String,
    },
    exteriorColorScheme: {
        type: String,
    },
    length: {
        type: Number,
    },
    width: {
        type: Number,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    }
    
>>>>>>> b82b60b998e7079b0d55887fabd439b5268ae74b
});

const RV = mongoose.model('RV', rvSchema);
module.exports = RV;