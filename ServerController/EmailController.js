var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var app = express();
var server = require("http").createServer(app);
server.listen(process.env.PORT || 3001);

app.get('/sayHello',function (req, res) {
    console.log(req);
    // Not the movie transporter!
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'viet.ptit.17@gmail.com', // Your email id
            pass: '' // Your password
        }
    });
    var text = 'Hello world from ';
    var mailOptions = {
        from: 'viet.ptit.17@gmail.com>', // sender address
        to: 'viet.ptit.17@gmail.com', // list of receivers
        subject: 'Email Example', // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
})
