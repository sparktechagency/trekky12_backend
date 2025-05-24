const mongoose = require('mongoose');


const tireSchema = new mongoose.Schema({
    tireBrand: {
        type: String,
        required: true
    },
    mfg: {
        type: String,
        required: true
    },
    modelNumber: {
        type: String,
        required: true
    },
    BTU: {
        type: Number,
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    initialMileage: {
        type: Number,
    },
    currentMileage: {
        type: Number,
    },
    tireSize: {
        type: String,
    },
    position: {
        type: String,
        required: true,
        enum: ['Front Left', 'Front Right', 'Rear Outer Left', 'Rear Inner Left', 'Mid Left', 'Mid Right', 'Rear', 'Spare']
    },
    price: {
        type: Number,
        required: true
    },
    vendor: {
        type: String,
    },
    picture: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },

    //when the tire was replaced/maintenace/ service
    technicalServiceDate: {
        type: Date,
    },
    technicalServiceVendor: {
        type: String,
    },
    technicalServiceCost: {
        type: Number,
    },
    rvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, {
    timestamps: true
});


module.exports = mongoose.model('Tire', tireSchema);
