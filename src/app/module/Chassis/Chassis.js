const mongoose = require('mongoose');

const chassisSchema = new mongoose.Schema({
    // Identification
    mfg: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true

    },
    modelName: String,
    serialId: Number,
    fuelType: String,
    engineModel: String,
    hoursePower: Number,
    belts: [{
        name: {
            type: String,
            required: true
        },
        partNumber: {
            type: Number,
            required: true
        }
    }],
    oilFilter: [{
        name: {
            type: String,
            required: true
        },
        partNumber: {
            type: Number,
            required: true
        }
    }],
    fuelFilter: [{           
        name: {
            type: String,
            required: true
        },
        partNumber: {
            type: Number,
            required: true
        } 
    }],
}, {timestamps: true});

const Chassis = mongoose.model('Chassis', chassisSchema);
module.exports = Chassis;

 
