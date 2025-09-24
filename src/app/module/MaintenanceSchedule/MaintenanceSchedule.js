const mongoose = require('mongoose')

const maintenanceSchedule = new mongoose.Schema({
    component: {
        type: String
    },
    maintenanceToBePerformed: {
        type: Date
    },
    rvType: {
        type: String
    },
    initialMilage: {
        type: Number
    },
    initial: {
        type: String
    },
    dateOfMaintenance: {
        type: Date
    },
    milageAtMaintenance: {
        type: Number
    },
    notes: {
        type: String 
    }
}, { timestamps: true })

const MaintenanceSchedule = mongoose.model('MaintenanceSchedule', maintenanceSchedule)

module.exports = MaintenanceSchedule;