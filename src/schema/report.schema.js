const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
   
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    message: {
        type: String,
        required: true
    },
    reportCount: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

module.exports = reportSchema
