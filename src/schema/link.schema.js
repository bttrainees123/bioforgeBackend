const mongoose = require('mongoose');
const linkSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    linkTitle: {
        type: String,

    },
    linkUrl: {
        type: String,

    },
    linkLogo: {
        type: String,

    },
    type: {
        type: String,
        enum: ['social', 'non_social'],
        default: 'social'

    },
     is_index: {
            type: Number,
            default: 0
        },
    is_deleted: {
        type: String,
        enum: ["0", "1"],
        default: "0"
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    visits: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            ipAddress: {
                type: String,
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            count: {
                type: Number,
                default: 0
            }
        }
    ]

}, {
    timestamps: true,
});
module.exports = linkSchema