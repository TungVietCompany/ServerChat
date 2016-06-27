var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    createDate: { type: Date, require: true},
    email: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    fullName: { type: String, required: false },
    note: { type: String, required: false },
    parent: { type: String, required: false },
    image: { type: String, required: false },
    valid: { type: Boolean, required: true }
});

module.exports = userSchema;