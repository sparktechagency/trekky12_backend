const mongoose = require('mongoose');

const chassisSchema = new mongoose.Schema({
    mfg: {
        type: String,
        required: true
    },
    modelNo: {
        type: String
    },
    name: {
        type: String
    },
    serialId: {
        type: String
    },
    fuelType: {
        type: String
    },
    engineModel: {
        type: String
    },
    rvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    belt: [{
        name: {
            type: String
        },
        partNo: {
            type: Number
        }
    }],
    fuelFilter: [{
        name: {
            type: String
        },
        partNo: {
            type: Number
        }
    }],
    oilFilter: [{
        name: {
            type: String
        },
        partNo: {
            type: Number
        }
    }]
},
    {
        timestamps: true
    });

const Chassis = mongoose.model('Chassis', chassisSchema);

module.exports = Chassis;

