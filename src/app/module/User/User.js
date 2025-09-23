const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'
    },
    rvIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV'
    }],
    phoneNumber: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        expiresAt: Date 
    },
    passwordResetCode: {
        type: String,
        expiresAt: Date
    },
    profilePic: {
        type: String,
    },
    passwordResetCodeExpiresAt: {
        type: Date,
        default: Date.now() + 10 * 60 * 1000
    },
    selectedRvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;