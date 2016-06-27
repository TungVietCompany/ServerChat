var app, crypto, express, multer, path, storage;
express = require('express');
multer = require('multer');
app = new express();
var fs = require('fs');
var mkdirp = require('mkdirp');
storage = multer.diskStorage({
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
    app.listen(3000, console.log("Listening on port 3000"));
