/**
 * Created by MtViet on 23/06/2016.
 */
var express = require('express');
var app = express();
var fs = require("fs");
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/ChatApp';
app.get('/listUsers', function (req, res) {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                console.log('Unable to connect to the mongoDB server');
            } else {
                //HURRAY!! We are connected. :)
                console.log('Connection established to', url);

                // Get the documents collection
                var collection = db.collection('Message');

                collection.find({userSend: 'viet', userRecieve: 'tung'}).toArray(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else if (result.length) {
                        res.json(result);
                    } else {
                        console.log('No record!');
                    }
                    //Close connection
                    db.close();
                });
            }

        });


})



var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)

})