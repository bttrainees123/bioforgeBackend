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
    },
    theme: {
        themeType: {
            type: String,
            enum: ["background", "subscribe", "free"],
            default: "free"
        },
        image: {
            type: String,
            
        }
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    is_deleted: {
        type: String,
        enum: ["0", "1"],
        default: "0"
    },
    isEmailVerified: {
        type: Boolean,
        enum: [true, false],
        default: false
    },
    // subscriptionExpiry: {
    //     type: Date,
    //     default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    // },
    // termsAndCondition: {
    //     type: Boolean,
    //     enum: [true, false],
    //     default:false
    // },
    // subscription: {
    //     subscriptionType: {
    //         type: String,
    //         enum: ["gold", "subscribe", "free"],
    //         default: "free"
    //     },
    //     amount: {
    //         type: Number,
    //         default: 0
    //     }
    // }
}, { timestamps: true });
module.exports = userSchema;
