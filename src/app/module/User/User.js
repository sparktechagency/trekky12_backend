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
    rvId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    varificationCode: {
        type: String,
        expiresAt: Date 
    },
    passwordResetCode: {
        type: String,
        expiresAt: Date
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