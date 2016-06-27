var mongoose = require('mongoose');
var shopSchema = require('./ModelSchema/ShopSchema');
var  productSchema = require('./ModelSchema/ProductSchema');
mongoose.connect('mongodb://localhost:27017/ChatApp');

//var Shop = mongoose.model('Shop',shopSchema,'Shop');
//var shops = new Shop({ID: 'vietmt',ShopName : 'Mai',CreateDate : 'Mai',Longitude : 123,Latitude :456,Address : 'Mai',Manager : 'Mai',Note: '123',Image : '123'});

//Student.update({firstName:'vietmt'},{lastName : 'Tao la vidfsdfdfsdfset day',studentId : 'bomayday'},{multi:false},function (err,data) {

//});

var Product = mongoose.model('Product',productSchema,'Product');
Product
    .findOne({ ID: 'vietmt' })
    .populate('ShopId')
    .exec(function (err, post) {
        if(err) throw err;
        console.log(post);
    });
//

//Product.create(products,function (err,data) {
//});
/*
var x = '123';
 Shop.find({ID: 'vietmt'},function (err,data) {
 console.log(data[0]._id);
 });
*/



