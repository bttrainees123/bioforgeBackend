const mongoose = require('mongoose');
const linkSchema = new mongoose.Schema(
  {
    link: [{
        linkTitle:{
            type: String,
            required: true
        },
        linkUrl: {
            type: String,
            required: true
        },
        linkLogo:{
            type: String,
            required: true
        },
        
    }]
  },
  { timestamps: true }
);
linkSchema.index({ expireOn: 1 }, { expireAfterSeconds: 0 });
module.exports = linkSchema
