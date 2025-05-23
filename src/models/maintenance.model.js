const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    //ambiguity about the RV
    //maintenance is for????
    //or automatically get the RV from the user 

    // rv: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'RV',
    //     required: true
    // },
    component: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    issue: { type: String },
    underWarranty: { type: Boolean, default: false },
    vendor: { type: String },
    maintenanceToBePerformed: { type: Date, required: true },
    dropOffDate: { type: Date },
    initialMileage: { type: Number, required: true },
    notes: { type: String },
    // Additional fields for updates
    
    
    invoiceNumber: { type: String },
    currentMileage: { type: Number },
    pictures: [{ type: String }], // Array of file paths
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'overdue'],
        default: 'pending'
    },
    completedDate: { type: Date },
    rv: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RV',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true
    });
const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
module.exports = Maintenance;