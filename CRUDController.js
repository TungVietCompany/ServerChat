var express = require('express');
var mongoose = require('mongoose');
var userController = require('./ServerController/UserController');
var shopContrller = require('./ServerController/ShopController');
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
    userController.DeleteUser(req.query.account,res);
});
//End Service người dùng

//Service cửa hàng
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
    userController.DeleteUser(req.query.account,res);
});
//End Service cửa hàng

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