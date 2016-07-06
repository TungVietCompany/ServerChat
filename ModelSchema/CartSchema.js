var mongoose = require('mongoose');
var shopSchema = require('./ShopSchema');
var productSchema = require('./ProductSchema');
var usesSchema = require('./UserSchema');
var schemaCart = new mongoose.Schema({
    userCreate: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shopID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
    productID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    quantity: { type: Number, required: true }
});
var Shop = mongoose.model('Shop',shopSchema,'Shop');
var Product = mongoose.model('Product',productSchema,'Product');
var User = mongoose.model('User',usesSchema,'User');
module.exports = schemaCart;