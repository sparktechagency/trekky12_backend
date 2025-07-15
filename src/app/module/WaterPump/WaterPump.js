const mongoose = require('mongoose');

const waterPumpSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    modelNumber: {
        type: String,

    },
    dateOfPurchase: {
        type: Date,

    },
    price: {
        type: Number,

    },
    notes: {
        type: String,
        default: '',
    },
    images: {
        type: [String], // image URLs or file paths
        default: [],
    },
    note: {
        type: String,
        default: '',
    }
}, { timestamps: true });

const WaterPump = mongoose.model('WaterPump', waterPumpSchema);

module.exports = WaterPump;
