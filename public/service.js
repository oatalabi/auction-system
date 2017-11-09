app.factory('Auction', function($http){
  return {
    userLogin: function(loginDetails) {
      return $http.post('/api/login', loginDetails);
    },
    updateUserBalance: function(auctionDetails) {
      return $http.put('/api/balance', auctionDetails);
    },
    getUserInventory: function(id) {
      return $http.get('api/user/inventory/' + id);
    }
  }
})