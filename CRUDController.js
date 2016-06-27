var express = require('express');
var mongoose = require('mongoose');
var userController = require('./ServerController/UserController');
var shopController = require('./ServerController/ShopController');
var productController = require('./ServerController/ProductController');
var URL_MONGO = 'mongodb://192.168.0.10:27017/ChatApp';
var app = express();
var server = require("http").createServer(app);
server.listen(process.env.PORT || 3000);
console.log("Server is running on port 3000");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var fs = require('fs');
var mkdirp = require('mkdirp');
var multer = require('multer');
///////////////////////////////////////////////////////////////////
try {
    mongoose.connect(URL_MONGO);
}
catch (err)
{
    console.log("Unable connect to Mongo");
}

//Service người dùng
app.get('/GetAccount',function (req,res) {
    userController.GetUser(req.query.account,res);
});
app.post('/AddUser',function (req,res) {
    console.log(req.body);
    userController.AddUser(req.body,res);
});
app.put('/UpdateUser',function (req,res) {
    userController.UpdateUser(req.body,res);
});
app.put('/DeleteUser',function (req,res) {
    userController.DeleteUser(req.query._id,res);
});
//End Service người dùng

//Service cửa hàng
app.get('/GetShop',function (req,res) {
    shopController.GetShop(req.query._id,res);
});
app.post('/AddShop',function (req,res) {
    console.log(req.body);
    shopController.AddShop(req.body,res);
});
app.put('/UpdateShop',function (req,res) {
    shopController.UpdateShop(req.body,res);
});
app.put('/DeleteShop',function (req,res) {
    shopController.DeleteShop(req.query._id,res);
});
//End Service cửa hàng

//Service hàng hóa
app.get('/GetProduct',function (req,res) {
    productController.GetProduct(req.query._id,res);
});
app.post('/AddProduct',function (req,res) {
    console.log(req.body);
    productController.AddProduct(req.body,res);
});
app.put('/UpdateProduct',function (req,res) {
    productController.UpdateProduct(req.body,res);
});
app.delete('/DeleteProduct',function (req,res) {
    productController.DeleteProduct(req.query._id,res);
});
//End service hàng hóa

//Upload Image
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var link = './Images/Mtviet1';
        var x = link.split('/');
        console.log(x[1]);
        try {
            var stats = fs.lstatSync(link);
        }
        catch (err)
        {
            mkdirp(link);
        }


        callback(null, link);
    },
    filename: function(req, file, cb ) {
        return cb(null, file.originalname);

    }
});

app.post('/', multer({
    storage: storage
}).single('upload'), function(req, res) {
    //console.log(req.body.name);
    return res.status(204).end();
});
app.get('/uploads/:file', function (req, res){
    file = req.params.file;
    var dirname = "./Images/Mtviet1/";
    var img = fs.readFileSync(dirname + file );
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');

});
//End image