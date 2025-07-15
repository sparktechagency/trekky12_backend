const mongoose = require('mongoose');

const ventFansSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    modelNumber: {
        type: String,

    },
    dateOfPurchase: {
        type: Date,

    },
    cost: {
        type: Number,

    },
    location: {
        type: String,
    },
    notes: {
        type: String,
        default: '',
    },
    images: {
        type: [String], // image URLs or file paths
        default: [],
    }
}, { timestamps: true });

const VentFans = mongoose.model('VentFans', ventFansSchema);

module.exports = VentFans;
