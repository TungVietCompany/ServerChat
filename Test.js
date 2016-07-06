var pg = require('pg');
var connectionString = "pg://postgres:anhviet17@localhost:5432/employees";
pg.connect(connectionString, function(err, client, done) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }
    var results = [];
    var query = client.query("SELECT * FROM items;");
    query.on('row', function(row) {
        results.push(row);
    });
    query.on('end', function() {
        console.log(results);

    });
});