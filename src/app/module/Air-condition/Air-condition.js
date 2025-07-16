const mongoose = require('mongoose');

const airConditionSchema = new mongoose.Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });


const AirCondition = mongoose.model('AirCondition', airConditionSchema);

module.exports = AirCondition;

