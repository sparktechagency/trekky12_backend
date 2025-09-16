const mongoose = require('mongoose');

const waterHeaterSchema = new mongoose.Schema({
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
    notes: {
        type: String,
        default: '',
    },
    images: {
        type: [String], // image URLs or file paths
        default: [],
    }
}, { timestamps: true });

const WaterHeater = mongoose.model('WaterHeater', waterHeaterSchema);

module.exports = WaterHeater;
