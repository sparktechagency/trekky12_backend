const mongoose = require('mongoose');

const newExpenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV',
        required: true
    },
    tripTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    state: {
        type: String,
        required: true
    },
    visitStatus: {
        type: String,
        required: true
    },
    tripType: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});
const Trip = mongoose.model('Trip', newExpenseSchema);
module.exports = Trip; 
