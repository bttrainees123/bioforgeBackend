const mongoose = require('mongoose');
const templateSchema = require("../schema/template.schema");
const templateModel = mongoose.model('template',templateSchema);
module.exports = templateModel;