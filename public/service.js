app.factory('Auction', function($http){
  var database = firebase.database();

  return {
    userLogin: function(loginDetails) {
      return $http.post('/api/login', loginDetails);
    },
    updateUserBalance: function(auctionDetails) {
      return $http.put('/api/balance', auctionDetails);
    },
    getUserInventory: function(id) {
      return $http.get('api/user/inventory/' + id);
    },
    registerBid: function(auctionDetails) {
      return database.ref("auction/items").set(auctionDetails)
    },
    updateBid: function(value) {
      return database.ref("auction/items/winningBid").set(value);
    },
    maxBid: function(bidValue) {
      console.log('im here')
      return database.ref("auction/bids/max").set(bidValue)
    },
    postBid: function(bidObj) {
      database.ref("auction/bids").push(bidObj)
    }
  }
});