var express = require('express');
var userController = require('./ServerController/UserController');
var shopController = require('./ServerController/ShopController');
var productController = require('./ServerController/ProductController');
var groupProductController = require('./ServerController/GroupProductController');
var cartController = require('./ServerController/CartController');
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

    ////////////////////////////////////////
//Service người dùng
app.get('/GetAccount',function (req,res) {
    userController.GetUser(req.query.account,res);
});
app.get('/GetUserId',function (req,res) {
    userController.GetUserID(req.query.account,res);
});
app.get('/CheckLogin',function (req,res) {
    userController.CheckLogin(req.query.userName,req.query.password,res);
});
app.post('/AddUser',function (req,res) {
    userController.AddUser(req.body,res);
});
app.put('/UpdateUser',function (req,res) {
    userController.UpdateUser(req.body,res);
});
app.put('/DeleteUser',function (req,res) {
    userController.DeleteUser(req.query._id,res);
});
//End Service người dùng

//Service hàng hóa
app.get('/GetProduct',function (req,res) {
    productController.GetProduct(req.query._id,res);
});
app.get('/GetListProduct',function (req,res) {
    productController.GetListProduct(req.query.manager,res);
});
app.post('/AddProduct',function (req,res) {
    productController.AddProduct(req.body,res);
});
app.put('/UpdateProduct',function (req,res) {
    productController.UpdateProduct(req.body,res);
});
app.delete('/DeleteProduct',function (req,res) {
    productController.DeleteProduct(req.query._id,res);
});
//End service hàng hóa

//Service cửa hàng
app.get('/GetShop',function (req,res) {
    shopController.GetShop(req.query._id,res);
});
app.get('/GetListShop',function (req,res) {
    shopController.GetListShop(req.query.manager,res);
});
app.post('/AddShop',function (req,res) {
    shopController.AddShop(req.body,res);
});
app.put('/UpdateShop',function (req,res) {
    shopController.UpdateShop(req.body,res);
});
app.put('/DeleteShop',function (req,res) {
    shopController.DeleteShop(req.query._id,res);
});
//End Service cửa hàng

//Service nhóm hàng
app.get('/GetAllGroupProduct',function (req,res) {
    groupProductController.GetAllGroupProduct(res);
});
//End service nhóm hàng

//Upload Image
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var forderName = file.originalname.split("::");
        var link = './Images/'+forderName[0];
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
        console.log(file.originalname.split("::")[1]);
        return cb(null, file.originalname.split("::")[1]);

    }
});

app.post('/', multer({
    storage: storage
}).single('upload'), function(req, res) {
    //console.log(req.body.name);
    return res.status(204).end();
});

app.get('/uploads/:file1/:file2', function (req, res){
    try {
        file = req.params.file1;
        file2 = req.params.file2;
        var dirname = "./Images/";
        var img = fs.readFileSync(dirname + file +'/'+ file2 );
        res.writeHead(200, {'Content-Type': 'image/png' });
        res.end(img, 'binary');
    }
    catch (err)
    {
        res.end(null, 'binary');
    }

});

process.on('uncaughtException', function(err)  {
    console.log(err);
});

//End image