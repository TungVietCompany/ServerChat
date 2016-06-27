var express = require('express');
var app = express();
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;

app.get('/test/:number1/:number2',function (req,res) {
    var para1 = req.params.number1;
    var para2 = req.params.number2;
    res.send(parseInt(para1) + parseInt(para2) + "");
});

//Start server
app.listen(3000,function () {
    console.log("Server is running on port 3000");
})