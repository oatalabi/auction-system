var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://postgres:postgres@localhost:5432/auction_game';
var db = pgp(connectionString);

function getAllUsers(req, res, next) {
  db.any('select * from users')
    .then(function(data) {
      console.log(data, '===================================')
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved ALL users'
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function findOrCreateUser(req, res, next) {
  var userName = req.body.username;
  db.oneOrNone('SELECT * FROM users WHERE username = ${userName}', {userName: userName}, function(user, err) {
    if (err) {
      return next(err);
    }
    if (user) {
      res.status(200).json({
        status: 'success',
        data: user,
        message: 'Retrieved ONE user'
      })
    }
    if (!user) {
      db.one('INSERT INTO users(username, balance) VALUES($1, $2) RETURNING id, username, balance', [userName, 1000])
        .then(function(data) {
          db.one('INSERT INTO inventories(user_id, bread, carrot, diamond) VALUES($1, $2, $3, $4)',
            [data.id, 30, 18, 1]);
          res.status(200).json({
            status: 'success',
            data: data,
            message: 'user created'
          });
        })
        .catch(function(err) {
          return next(err);
        });
    }
  })
}

function getUserInventory(req, res, next) {
  var id = req.params.user_id;
  db.oneOrNone('SELECT * FROM inventories WHERE user_id = ${userId}', {userId: id}, function(inventory, err) {
    if (err) {
      return next(err);
    }
    if (inventory) {
      res.status(200).json({
        status: 'success',
        data: inventory,
        message: 'Retrieved user inventory'
      })
    }
  })
}

function balanceUpdate(req, res, next) {
  var auctionItem = req.body.auctionItem; // name, quantity, winningBid
  var sellerDetails = req.body.seller; // id, name
  var buyerDetails = req.body.buyer; //id, name
  var auctionItemName = auctionItem.name;

  db.one('SELECT * FROM users WHERE username = ${userName}', {userName: sellerDetails.name}, function(user, err) {
    if (err) {
      return next(err);
    }
    if (user) {
      console.log(user, 'user===========')
      var newSellerBalance = user.balance + parseInt(auctionItem.winningBid);
      db.none('UPDATE users SET balance = $1 WHERE id = $2', [newSellerBalance, user.id]);
      db.one('SELECT * FROM inventories WHERE user_id = ${sellerId}', {sellerId: user.id}, function(inventory, err) {
        if (err) {
          return next(err);
        }
        if (inventory) {
          var newSellerInventory = inventory[auctionItemName] - parseInt(auctionItem.quantity);
          if(auctionItem.name == 'bread') {
            db.none('UPDATE inventories SET bread = $1 WHERE user_id = $2', [newSellerInventory, user.id], function(inventory, err){

            });
          }
          if(auctionItem.name == 'carrot'){
            db.none('UPDATE inventories SET carrot = $1 WHERE user_id = $2', [newSellerInventory, user.id]);
          }
          if(auctionItem.name == 'diamond'){
            db.none('UPDATE inventories SET diamond = $1 WHERE user_id = $2', [newSellerInventory, user.id]);
          }
          res.status(200).json({
            status: 'success',
            message: 'inventory updated'
          });
        }
      })
    }
  })

  db.one('SELECT * FROM users WHERE username = ${userName}', {userName: buyerDetails.name}, function(user, err) {
    if (err) {
      return next(err);
    }
    if (user) {
      var newBuyerBalance = user.balance - parseInt(auctionItem.winningBid);
      db.none('UPDATE users SET balance = $1 WHERE id = $2', [newBuyerBalance, user.id]);
      db.one('SELECT * FROM inventories WHERE user_id = ${buyerId}', {buyerId: user.id}, function(inventory, err) {
        if (err) {
          return next(err);
        }
        if (inventory) {
          var newBuyerInventory = inventory[auctionItemName] + parseInt(auctionItem.quantity);
          if(auctionItem.name == 'bread') {
            db.none('UPDATE inventories SET bread = $1 WHERE user_id = $2', [newBuyerInventory, user.id]);
          }
          if(auctionItem.name == 'carrot'){
            db.none('UPDATE inventories SET carrot = $1 WHERE user_id = $2', [newBuyerInventory, user.id]);
          }
          if(auctionItem.name == 'diamond'){
            db.none('UPDATE inventories SET diamond = $1 WHERE user_id = $2', [newBuyerInventory, user.id]);
          }
          res.status(200).json({
            status: 'success',
            message: 'inventory updated'
          });
        }
      })
    }
  })
}

module.exports = {
  getAllUsers: getAllUsers,
  findOrCreateUser: findOrCreateUser,
  balanceUpdate: balanceUpdate,
  getUserInventory: getUserInventory
};