const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
        enum: ['ADMIN', 'SUPER_ADMIN'],
        default: 'ADMIN'
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

} , { timestamps: true }); 

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;