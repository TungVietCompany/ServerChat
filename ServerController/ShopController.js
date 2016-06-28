var shopSchema = require('../ModelSchema/ShopSchema');
var mongoose = require('mongoose');
var Shop = mongoose.model('Shop',shopSchema,'Shop');
//Lấy 1 đối tượng cửa hàng
function GetShop(_id,res) {
    Shop.findOne({ _id: _id}).exec(function (err, data) {
        if(err) throw err;
        res.json(data);
    });
}
//Thêm 1 đối tượng cửa hàng
function AddShop(shop1,res) {
    var shop = new Shop(shop1);
    Shop.find({ shopName:  shop.shopName , manager: shop1.manager}).exec(function (err, data) {
        if(err) throw err;
        if(data.length > 0)
        {
            res.json({status:"Failed"});
        }
        else
        {
            //save data
            Shop.create(shop,function (err,data) {
                if(err) res.json({status:"Failed"});
                res.json({status:"Success"});
            });
        }
    });
}

//Chỉnh sửa 1 đối tượng cửa hàng

function UpdateShop(shop1,res) {
    var shop = new Shop(shop1);
    Shop.update({_id : shop1._id},{ID : shop.ID,shopName: shop.shopName,
        longitude: shop.longitude,latitude: shop.latitude,address:shop.address,note:shop.note,image:shop.image},function (err,data) {
        if(err) res.json({status:"Failed"});
        res.json({status:"Success"});
    });
}

//Xóa 1 đối tượng cửa hàng

function DeleteShop(shopID,res) {
    Shop.update({_id : shopID},{valid:false},function (err,data) {
        if(err) res.json({status:"Failed"});
        res.json({status:"Success"});
    });
}

module.exports.GetShop = GetShop;
module.exports.AddShop = AddShop;
module.exports.UpdateShop = UpdateShop;
module.exports.DeleteShop = DeleteShop;