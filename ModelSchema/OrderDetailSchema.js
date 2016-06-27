var mongoose = require('mongoose');
var schemaOrderDetail = new mongoose.Schema({
    ID: { type: String, required: true },
    OrderId: { type: String, required: true },
    ProductId: { type: String, require: true},
    Quantity: { type: Number, required: true },
    Price: { type: Number, required: true }
});

module.exports = schemaOrderDetail;