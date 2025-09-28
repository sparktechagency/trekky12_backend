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
    modelYear: {
        type: String,
    },
    model: {
        type: String
    },
    dateOfPurchase: {
        type: Date,
    },
    amountPaid: {
        type: Number,
    },
    condition: {
        type: String
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
    },
    isOverdueForMaintenance: {
        type: Boolean,
        default: false
    },
    overdueMaintenanceCount: {
        type: Number,
        default: 0
    },
    nextMaintenanceDate: {
        type: Date
    },
    nextMaintenanceMileage: {
        type: Number
    },
    lastMaintenanceCheck: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    chassis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chassis'
    }
}, {
    timestamps: true
});

const RV = mongoose.model('RV', rvSchema);
module.exports = RV;