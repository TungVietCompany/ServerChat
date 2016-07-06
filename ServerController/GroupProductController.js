var pg = require('pg');
var connectionString = require('./PostgreConnectionController');

function GetAllGroupProduct(res) {
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var results = [];
        var query = client.query("SELECT * FROM get_all_groupproduct();");
        query.on('row', function(row) {
            results.push(row);
        });
        query.on('end', function() {
            done();
            res.json(results);
        });
    });

}

module.exports.GetAllGroupProduct = GetAllGroupProduct;














/*var groupProductSchema = require('../ModelSchema/GroupProductSchema');
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

module.exports.GetProductGroup = GetProductGroup;*/