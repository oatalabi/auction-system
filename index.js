var express = require('express');
var app = express();
var pg = require('pg');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var db = require('./queries');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(methodOverride('X-HTTP-Method-Override'));

app.route('/api/users').get(db.getAllUsers);
app.route('/api/user/inventory/:user_id').get(db.getUserInventory);
app.route('/api/login').post(db.findOrCreateUser);
app.route('/api/balance').put(db.balanceUpdate);
app.get('*', function(req, res){
  res.sendfile('./public/index.html');
})

app.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});

module.exports = app;