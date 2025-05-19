const mongoose = require('mongoose');


const exhustFansSchema = new mongoose.Schema({ 
     name: {
            type: String,
            required: true
        },
        mfg: {
            type: String,
            required: true 
        },
        modelNumber: {
            type: String,
            required: true
        },
        BTU: {
            type: String,
            required: true
        }, 
        dateOfPurchase: {
            type: String,
            required: true
        }, 
        location: {
            type: String,
            required: true,
            enum: ['Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'Mid Left', 'Mid Right', 'Rear']
        },
        price: {    
            type: Number,
            required: true
        },
        vendor: {
            type: String,
            required: true
        },
        picture: {
            type: String,
            required: true
        },
        notes: {
            type: String,
            required: true
        }, 
        rvId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RV',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

}, {
    timestamps: true
});


const ExhustFans = mongoose.model('ExhustFans', exhustFansSchema);
exports = ExhustFans;
 