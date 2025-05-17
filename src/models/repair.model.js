const mongoose = require('mongoose');


const repairSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    dorpOffDate: {
        type: Date,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    repair: {
        type: String,
        required: true
    },  
        message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
     rv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV',
        required: true
    },
}, { timestamps: true });
const Repair = mongoose.model('Repair', repairSchema);
module.exports = Repair;
