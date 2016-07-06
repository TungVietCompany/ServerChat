var pg = require('pg');
var connectionString = require('./PostgreConnectionController');

function AddProduct(product,res) {

    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var results = [];
        var query = client.query("SELECT * FROM get_id_product('"+product.product_id+"');");
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
                console.log("SELECT * FROM insert_product('"+product._id+"','"+product.product_id+"','"+product.product_name+"'," +
                    "'now()','"+product.group_product+"','"+product.note+"',"+product.money_purchase+","+product.money_order+",'"+product.manager+"','{"+product.image+"}');");
                query = client.query("SELECT * FROM insert_product('"+product._id+"','"+product.product_id+"','"+product.product_name+"'," +
                    "'now()','"+product.group_product+"','"+product.note+"',"+product.money_purchase+","+product.money_order+",'"+product.manager+"','{"+product.image+"}');");
                query.on('end', function() {
                    done();
                    res.json({status:"Success"});
                });
            }

        });
    });
}

function GetListProduct(manager,res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var results = [];
        var query = client.query("SELECT * FROM get_all_product('"+manager+"');");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            res.json(results);
        });
    });

}


function UpdateProduct(product,res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        query = client.query("SELECT * FROM update_product('"+product._id+"','"+product.product_id+"','"+product.product_name+"'," +
            "'"+product.group_product+"','"+product.note+"','"+product.image+"',"+product.money_purchase+","+product.money_order+");");
        query.on('end', function() {
            done();
            res.json({status:"Success"});
        });
    });
}


module.exports.AddProduct = AddProduct;
module.exports.GetListProduct = GetListProduct;
module.exports.UpdateProduct = UpdateProduct;








/*var productSchema = require('../ModelSchema/ProductSchema');
var mongoose = require('mongoose');
var Product = mongoose.model('Product',productSchema,'Product');
//Lấy 1 đối tượng hàng hóa
function GetProduct(_id,res) {
    Product.findOne({ _id: _id}).exec(function (err, data) {
        if(err) throw err;
        res.json(data);
    });
}

function GetListProduct(res) {
    Product.find({}, function(err, data) {
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


//Thêm 1 đối tượng hàng hóa
function AddProduct(product,res) {
    var product = new Product(product);
    Product.find({ ID:  product.ID,shopId:product.shopId}).exec(function (err, data) {
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
    Product.find({ ID:  product.ID,_id:{$ne:product1._id}}).exec(function (err, data) {
        if(err) throw err;
        if(data.length > 0)
        {
            res.json({status:"Failed"});
        }
        else
        {
            Product.update({_id : product1._id},{ID : product.ID,productName: product.productName,
                moneyPurchase: product.moneyPurchase,moneyOrder: product.moneyOrder,groupProduct:product.groupProduct
                ,note:product.note,shopId:product.shopId,image:product.image},function (err,data1) {
                if(err) res.json({status:"Failed"});
                res.json({status:"Success"});
            });
        }
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
module.exports.GetListProduct = GetListProduct;
    */