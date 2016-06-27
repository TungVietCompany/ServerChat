var mongoose = require('mongoose');
var shopSchema = require('./ShopSchema');
var schemaProduct = new mongoose.Schema({
    ID: { type: String, required: true },
    productName: { type: String, required: true },
    createDate: { type: Date, require: true},
    moneyPurchase: { type: Number, required: true },
    moneyOrder: { type: Number, required: true },
    groupProduct: { type: String, required: true },
    note: { type: String, required: true },
    shopId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
    image: { type: String, required: true }
});
var Shop = mongoose.model('Shop',shopSchema,'Shop');
module.exports = schemaProduct;