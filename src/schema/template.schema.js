const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    templateName: {
        type: String,
    },
    templateContent: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    is_deleted: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
    
},{timestamps: true});
module.exports = templateSchema;