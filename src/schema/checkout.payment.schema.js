// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const checkoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    subscriptionExpiry: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    subscription: {
        subscriptionType: {
            type: String,
            enum: ["premium", "pro", "free", "expired"],
            default: "free"
        },
        amount: {
            type: Number,
            default: 0
        },
        paypalSubscriptionId: {
            type: String,
            default: null
        },
        paypalPlanId: {
            type: String,
            default: null
        },
        subscriptionStatus: {
            type: String,
            enum: ['APPROVAL_PENDING', 'APPROVED', 'ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED'],
            default: null
        },
        nextBillingTime: {
            type: Date,
            default: null
        },
        lastPaymentDate: {
            type: Date,
            default: null
        },
        lastPaymentAmount: {
            type: Number,
            default: 0
        }
    },

}, { timestamps: true });

module.exports = checkoutSchema;

