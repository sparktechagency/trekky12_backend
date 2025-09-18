const mongoose = require('mongoose');

const chassisSchema = new mongoose.Schema({
    mfg: {
        type: String,
        required: true
    },
    modelNo: {
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
    fuelType: {
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
            type: String,
            required: true
        },
        partNo: {
            type: Number,
            required: true
        }
    }],
    fuelFilter: [{
        name: {
            type: String,
            required: true
        },
        partNo: {
            type: Number,
            required: true
        }
    }],
    oilFilter: [{
        name: {
            type: String,
            required: true
        },
        partNo: {
            type: Number,
            required: true
        }
    }]
},
    {
        timestamps: true
    });

const Chassis = mongoose.model('Chassis', chassisSchema);

module.exports = Chassis;

