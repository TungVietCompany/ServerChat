var mongoose = require('mongoose');
var schemaProductInstock = new mongoose.Schema({
    ID: { type: String, required: true },
    ShopId: { type: String, required: true },
    ProductId: { type: String, require: true},
    Quantity: { type: Number, required: true }
});

module.exports = schemaProductInstock;