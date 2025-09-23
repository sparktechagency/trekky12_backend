const mongoose = require('mongoose');

const heaterSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  modelNumber: {
    type: String,
  },
  dateOfPurchase: {
    type: Date,
  },
  location: {
    type: String,
  },
  cost: {
    type: Number,
  },
  images: [{
    type: String,
    default: []
  }],
  notes: {
    type: String,
    default: '',
  },
  rvId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RV',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Heater', heaterSchema);

