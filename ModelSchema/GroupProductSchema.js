var mongoose = require('mongoose');
var schemaGroupProduct = new mongoose.Schema({
    _id: { type: String, required: true },
    groupName_VN: { type: String, required: true },
    groupName_ENG: { type: Date, require: true},
});
module.exports = schemaGroupProduct;