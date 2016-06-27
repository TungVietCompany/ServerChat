var mongoose = require('mongoose');
var schemaMessage = new mongoose.Schema({
    UserSend: { type: String, required: true },
    UserReceive: { type: String, required: true },
    CreateDate: { type: Date, require: true},
    Data: { type: String, required: true },
    DataType: { type: Number, required: true },
    TypeAction: { type: String, required: true },
    MessageNumber: { type: String, required: true },
    Status: { type: String, required: true }
});

module.exports = schemaMessage;