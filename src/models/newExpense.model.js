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
    expenseType: {
        type: String,
        required: true
    },
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
    cost : {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    pictures: {
        type: [String],
        required: true
    },
    note: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const NewExpense = mongoose.model('NewExpense', newExpenseSchema);
module.exports = NewExpense;