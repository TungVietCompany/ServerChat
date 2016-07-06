var cartSchema = require('../ModelSchema/CartSchema');
var productSchema = require('../ModelSchema/ProductSchema');
var mongoose = require('mongoose');
var Cart = mongoose.model('Cart',cartSchema,'Cart');
var Product = mongoose.model('Product',productSchema,'Product');
function AddCart(cart1,res) {
    console.log(cart1);
    var cart = new Cart(cart1);
    console.log(cart);
    try
    {
        Cart.find({userCreate :  cart1.userCreate,shopID:cart1.shopID,productID:cart1.productID}).exec(function (err, data) {
            if(err) throw err;
            if(data.length > 0)
            {
                res.json({status:"Failed"});
            }
            else
            {
                Cart.create(cart,function (err,data) {
                    if(err) res.json({status:"Failed"});
                    res.json({status:"Success"});
                });
            }
        });
    }
    catch (err)
    {
        res.json({status:"Failed"});
    }
}

function GetCart(res) {
    Cart.aggregate([
        { $lookup: {from: "Product", localField: "productID", foreignField: "_id", as: "countryName"} }
    ]).exec(function (err, data) {
        if(err) throw err;
        console.log(data);
        res.json(data);
    });
}
module.exports.AddCart = AddCart;
module.exports.GetCart = GetCart;