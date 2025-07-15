const mongoose = require('mongoose');

const cellingFansSchema = new mongoose.Schema({
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
    notes: {
        type: String,
        default: '',
    },
    images: {
        type: [String], // image URLs or file paths
        default: [],
    }
}, { timestamps: true });
    
const CellingFans = mongoose.model('CellingFans', cellingFansSchema);

module.exports = CellingFans;
