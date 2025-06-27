const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    type: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    bio: {
        type: String,
    },
    profile_img: {
        type: String,
        default: "d8.webp" 
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    links: [{
        linkTitle: {
            type: String,
            required: true,
        },
        linkUrl: {
            type: String,
            required: true,
        },
        linkLogo: {
            type: String,
            required: true,
        },
        is_index:{
            type:Number
        }
    }],
    theme: {
        themeType: {
            type: String,
            enum: ["color", "img"],
        },
        fontFamily: {
            type: String
        },
        is_colorImage: {
            type: String,
        }
    },
    is_deleted: {
        type: String,
        enum: ["0", "1"],
        default: "0"
    },
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});
module.exports = userSchema;

