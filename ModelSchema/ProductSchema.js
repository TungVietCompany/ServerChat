var mongoose = require('mongoose');
var shopSchema = require('./ShopSchema');
var schemaProduct = new mongoose.Schema({
    ID: { type: String, required: true },
    ProductName: { type: String, required: true },
    CreateDate: { type: Date, require: true},
    MoneyPurchase: { type: Number, required: true },
    MoneyOrder: { type: Number, required: true },
    GroupProduct: { type: String, required: true },
    Note: { type: String, required: true },
    ShopId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
    Image: { type: String, required: true }
});
var Shop = mongoose.model('Shop',shopSchema,'Shop');
module.exports = schemaProduct;