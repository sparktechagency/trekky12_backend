const mongoose = require('mongoose');

const rvSchema = new mongoose.Schema({
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
    
}, {
    timestamps: true
});

const RV = mongoose.model('RV', rvSchema);
module.exports = RV;