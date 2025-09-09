const mongoose = require('mongoose');

const tireSchema = new mongoose.Schema({
    manufacturer: {
        type: String
    },
    tireSize: {
        type: String
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
    note: {
        type: String
    },
    images: [{
        type: String,
    }]
}, {
    timestamps: true
});

const Tire = mongoose.model('Tire', tireSchema);


module.exports = Tire;