const mongoose = require('mongoose');


const expenseSchema = new mongoose.Schema({
    expenseType: {
        type: String,
    },
    date: {
        type: Date,
    },
    vendor: {
        type: String,
    },
    cityOrState: {
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

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
