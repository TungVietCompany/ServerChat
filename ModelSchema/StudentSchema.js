var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});

module.exports = userSchema;