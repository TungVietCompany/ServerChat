var mongoose = require('mongoose');
var shopSchema = require('./ShopSchema');
var groupProductSchema = require('./GroupProductSchema');
var schemaProduct = new mongoose.Schema({
    ID: { type: String, required: true },
    productName: { type: String, required: true },
    createDate: { type: Date, require: true},
    moneyPurchase: { type: Number, required: true },
    moneyOrder: { type: Number, required: true },
    groupProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupProduct' }],
    note: { type: String, required: false },
    shopId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
    image: { type: String, required: false }
});
var Shop = mongoose.model('Shop',shopSchema,'Shop');
var GroupProduct = mongoose.model('GroupProduct',groupProductSchema,'GroupProduct');
module.exports = schemaProduct;