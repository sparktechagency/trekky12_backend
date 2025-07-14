const mongoose = require('mongoose');

const tireSchema = new mongoose.Schema({
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
    }]
}, {
    timestamps: true
});

const Tire = mongoose.model('Tire', tireSchema);


module.exports = Tire;