const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, 'Insurance company name is required'],
        trim: true
    },
    websiteLink: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    effectiveDate: {
        type: Date,
        required: [true, 'Effective date is required']
    },
    renewalDate: {
        type: Date,
        required: [true, 'Renewal date is required']
    },
    cost: {
        type: Number,
        required: [true, 'Cost is required']
    },
    policyNumber: {
        type: String,
        required: [true, 'Policy number is required'],
        unique: true,
        trim: true
    },
    pictures: [{
        type: String
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Insurance', insuranceSchema);