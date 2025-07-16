const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({
    reportTitle: {
        type: String,
    },
    dateOfService: {
        type: Date,
    },
    area: {
        type: String,
    },
    odometerReading: {
        type: Number,
    },
    cost: {
        type: Number,
    },
    note: {
        type: String,
    },
}, {
    timestamps: true
})

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
