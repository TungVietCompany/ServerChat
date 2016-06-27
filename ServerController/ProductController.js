var productSchema = require('../ModelSchema/ProductSchema');
var mongoose = require('mongoose');
var Product = mongoose.model('Product',productSchema,'Product');
//Lấy 1 đối tượng hàng hóa
function GetProduct(_id,res) {
    Product.findOne({ _id: _id}).exec(function (err, data) {
        if(err) throw err;
        res.json(data);
    });
}
//Thêm 1 đối tượng hàng hóa
function AddProduct(product,res) {
    var product = new Product(product);
    Product.find({ productName:  product.productName}).exec(function (err, data) {
        if(err) throw err;
        if(data.length > 0)
        {
            res.json({status:"Failed"});
        }
        else
        {
            //save data
            Product.create(product,function (err,data) {
                if(err) res.json({status:"Failed"});
                res.json({status:"Success"});
            });
        }
    });
}

//Chỉnh sửa 1 đối tượng hàng hóa

function UpdateProduct(product1,res) {
    var product = new Product(product1);
    Product.update({_id : product1._id},{ID : product.ID,productName: product.productName,
        moneyPurchase: product.moneyPurchase,moneyOrder: product.moneyOrder,groupProduct:product.groupProduct
        ,note:product.note,shopId:product.shopId,image:product.image},function (err,data) {
        if(err) res.json({status:"Failed"});
        res.json({status:"Success"});
    });
}

//Xóa 1 đối tượng hàng hóa

function DeleteProduct(_id,res) {
    Product.remove({_id : _id},function (err,data) {
        if(err) res.json({status:"Failed"});
        res.json({status:"Success"});
    });
}

module.exports.GetProduct = GetProduct;
module.exports.AddProduct = AddProduct;
module.exports.UpdateProduct = UpdateProduct;
module.exports.DeleteProduct = DeleteProduct;