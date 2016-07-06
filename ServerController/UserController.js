var pg = require('pg');
var connectionString = require('./PostgreConnectionController');

function AddUser(user,res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var results = [];
        var query = client.query("SELECT * FROM getiduser('"+user.username+"');");
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
                query = client.query("SELECT * FROM insertusersystem('"+user.username+"','"+user.password+"','"+user.email+"'," +
                    "'"+user.phone_number+"','"+user.fullname+"','"+user.note+"','"+user.parent+"','"+user.image+"',true,false,now());");
                query.on('end', function() {
                    done();
                    res.json({status:"Success"});
                });
            }

        });
    });

}

module.exports.AddUser = AddUser;












/*


module.exports.GetUser = GetUser;

module.exports.UpdateUser = UpdateUser;
module.exports.DeleteUser = DeleteUser;
module.exports.CheckLogin = CheckLogin;
module.exports.GetUserID = GetUserID;
/*var userSchema = require('../ModelSchema/UserSchema');
var mongoose = require('mongoose');
var User = mongoose.model('User',userSchema,'User');
//Lấy 1 đối tượng người dùng
function GetUser(account,res)
{
    User.findOne({ userName:  account}).exec(function (err, post) {
        if(err) throw err;
        res.json(post);
    });
}

//Lấy _id của người dùng
function GetUserID(userName,res) {
    User.findOne({ userName: userName}).exec(function (err, data) {
        if(err) throw err;
        res.json({status:data._id});
    });
}

//Thêm 1 đối tượng người dùng

function AddUser(user,res) {
    var user = new User(user);
    try
    {
        User.find({ userName:  user.userName}).exec(function (err, data) {
            if(err) throw err;
            if(data.length > 0)
            {
                res.json({status:"Failed"});
            }
            else
            {
                //save data
                User.create(user,function (err,data) {
                    if(err) res.json({status:"Failed"});
                    res.json({status:"Success"});
                });
            }
        });
    }
    catch (err)
    {
        res.json({status:"Failed"});
    }
}

//Chỉnh sửa 1 đối tượng người dùng

function UpdateUser(user1,res) {
    var user = new User(user1);
    User.update({_id : user1._id},{email : user.email,phoneNumber: user.phoneNumber,
        fullName: user.fullName,note: user.note,parent:user.parent,image:user.image},function (err,data) {
        if(err) res.json({status:"Failed"});
        res.json({status:"Success"});
    });
}

//Xóa 1 đối tượng

function DeleteUser(_id,res) {
    User.update({_id : _id},{valid:false},function (err,data) {
        if(err) res.json({status:"Failed"});
        res.json({status:"Success"});
    });
}

//Kiểm tra thông tin đăng nhập

function CheckLogin(username,password,res) {
    User.find({ userName: username,password:password}).exec(function (err, data) {
        if(err) throw err;
        if(data.length > 0)
        {
            res.json({status:data[0]._id});
        }
        else
        {
            res.json({status:""});
        }
    });
}

//Kiểm tra tài khoản đã tồn tại

function CheckUserExits(username,res) {
    User.findOne({userName : username},function (err,data) {
        if(err) {
            console.log(err);
            res.json({status:"Failed"});
        }
        if(data.length > 0)
        {
            res.json({status:"Failed"});
        }
        else
        {
            res.json({status:"Success"});
        }
    });



}


function DeleteUser(user,res) {
    var user = user;
    User.remove({userName : user},function (err,data) {
        if(err) res.json({status:"Failed"});
        res.json({status:"Success"});
    });
}
*/
