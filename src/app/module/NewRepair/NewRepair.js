const mongoose = require('mongoose');


const newRepairSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    vendor: {
        type: String,
    },
    cityState: {
        type: String,
    },
    cost: {
        type: Number, 
    },
    qty: {
        type: Number,
    },
    images: {
        type: [String],
        default: [],
    },
    notes: {
        type: String,
        default: '',
    }
}, {
    timestamps: true
})

const NewRepair = mongoose.model('NewRepair', newRepairSchema);

module.exports = NewRepair;
