const mongoose = require('mongoose');
    const linkSchema = new mongoose.Schema({
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
});
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
        color:[{
            colorName: {
                type: String,
                default: "#000000"
            },
            colorCode: {
                type: String,
                default: "#000000"
            }
        }],
        image: {
            type: String,
            
        }
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    links: [linkSchema],
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
    
}, { timestamps: true });
module.exports = userSchema;
