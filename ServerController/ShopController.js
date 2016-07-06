var pg = require('pg');
var connectionString = require('./PostgreConnectionController');

function AddShop(shop,res) {
    //console.log(shop);
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var results = [];
        var query = client.query("SELECT * FROM get_id_shop('"+shop.shop_id+"');");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            if(results.length > 0)
            {
                done();
                res.json({status:"Failed"});
            }
            else
            {

                query = client.query("SELECT * FROM insert_shop('"+shop._id+"','"+shop.shop_id+"','"+shop.shop_name+"'," +
                    "'"+shop.address+"','"+shop.note+"','"+shop.image+"',"+shop.longitude+","+shop.latitude+",now(),'"+shop.manager+"');");
                query.on('end', function() {
                    done();
                    res.json({status:"Success"});
                });
            }

        });
    });
}

function GetListShop(manager,res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var results = [];
        var query = client.query("SELECT * FROM get_all_shop('"+manager+"');");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            res.json(results);
        });
    });

}

function UpdateShop(shop,res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var results = [];
        var query = client.query("SELECT * FROM get_id_shop('"+shop.shop_id+"');");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            query = client.query("SELECT * FROM update_product('"+shop._id+"','"+shop.shop_id+"','"+shop.shop_name+"'," +
                "'"+shop.address+"','"+shop.note+"','"+shop.image+"',"+shop.longitude+","+shop.latitude+");");
            query.on('end', function() {
                done();
                res.json({status:"Success"});
            });
        });
    });
}

module.exports.AddShop = AddShop;
module.exports.GetListShop = GetListShop;























/*var shopSchema = require('../ModelSchema/ShopSchema');
var mongoose = require('mongoose');
var Shop = mongoose.model('Shop',shopSchema,'Shop');
var ObjectId = require('mongoose').Types.ObjectId;
//Lấy 1 đối tượng cửa hàng
function GetShop(_id,res) {
    Shop.findOne({ _id: _id}).exec(function (err, data) {
        if(err) throw err;
        res.json(data);
    });
}

function GetListShop(manager,res) {
    Shop.find({ manager: manager}).exec(function (err, data) {
        if(err) throw err;
        if(data.length > 0)
        {
            res.json(data);
        }
        else
        {
            res.json(null);
        }
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
module.exports.GetListShop = GetListShop;*/