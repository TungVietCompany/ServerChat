var groupProductSchema = require('../ModelSchema/GroupProductSchema');
var mongoose = require('mongoose');
var GroupProduct = mongoose.model('GroupProduct',groupProductSchema,'GroupProduct');


function GetProductGroup(res) {
    GroupProduct.find({}, function(err, data) {
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

module.exports.GetProductGroup = GetProductGroup;