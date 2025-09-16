const mongoose = require('mongoose');

const checklistSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    items: [{
        type: String,
    }]
}, { timestamps: true });
    
const Checklist = mongoose.model('Checklist', checklistSchema);

module.exports = Checklist;
