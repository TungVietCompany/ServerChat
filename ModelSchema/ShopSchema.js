var mongoose = require('mongoose');
var userSchema = require('./UserSchema');
var schemaShop = new mongoose.Schema({
    ID: { type: String, required: true },
    shopName: { type: String, required: true },
    createDate: { type: Date, require: true},
    longitude: { type: Number, required: false },
    latitude: { type: Number, required: false },
    address: { type: String, required: false },
    manager: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    note: { type: String, required: false },
    image: { type: String, required: false },
    valid: { type: Boolean, required: true }
});
var User = mongoose.model('User',userSchema,'User');
module.exports = schemaShop;