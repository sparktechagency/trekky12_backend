const mongoose = require('mongoose');

const chassisSchema = new mongoose.Schema({
    fuelType: {
        type: String,
        required: true
    },
    addBelt: {
        type: String,
        required: true
    },
    addAnotherBelt: {
        type: String,
        required: true
    },
    addOilFilter: {
        type: String,
        required: true
    },
    addAnotherOuilFilter: {
        type: String,
        required: true
    },
    hoursePower: {
        type: String,
        required: true
    },
    mfg: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    serialId: {
        type: String,
        required: true
    },
    engineModel: {
        type: String,
        required: true
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
const Chassis = mongoose.model('Chassis', chassisSchema);
module.exports = Chassis;