const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({  
    //under this membership how many RVs are there?
    //which RV the membership is for????
    //ambiguity about the RV

    // rv: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'RV',
    //     required: true
    // },
    name: { type: String, required: true },
    datePurchased: { type: Date, required: true },
    website: { type: String },
    phoneNumber: { type: String },
    accountNumber: { type: String },
    amountPaid: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    picture: { type: String }, // URL or file path  
    notes: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    }, { timestamps: true });


module.exports = mongoose.model('Membership', membershipSchema);
// This schema defines the structure of the Membership document in MongoDB.