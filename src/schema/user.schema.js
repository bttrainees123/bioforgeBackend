const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    bio: {
        type: String
    },
    profile_img: {
        type: String,
        default: "d8.webp"
    },
    banner_img: {
        type: String,
        default: "d2.webp"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    theme: {
        themeType: {
            type: String,
            enum: ["color", "img"]
        },
        fontFamily: {
            type: String
        },
        fontColor: {
            type: String
        },
        is_colorImage: {
            type: String
        }
    },
    is_deleted: {
        type: String,
        enum: ["0", "1"],
        default: "0"
    },inactiveReason: {
        type: String,
        enum: ['Multiple reports', 'Admin action', 'Violation', 'Other'],
        default: null
    },
    inactivatedAt: {
        type: Date,
        default: null
    },
    reportCount: {
        type: Number,
        default: 0
    },
    reportStatus:{
        type:String,
        default:'false',
        enum:['true','false']
    },
    template:{
        templateName:String,
        templateContent :String
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: false,
        transform: function (doc, ret) {
            if (ret.links && Array.isArray(ret.links)) {
                ret.links.forEach(link => {
                    delete link.id;
                });
            }
            return ret;
        }
    },
    toObject: {
        virtuals: false,
        transform: function (doc, ret) {
            if (ret.links && Array.isArray(ret.links)) {
                ret.links.forEach(link => {
                    delete link.id;
                });
            }
            return ret;
        }
    }
});

module.exports = userSchema;
