app.controller('AuctionCtrl', ['$scope', 'Auction', '$location', '$cookies', function($scope, Auction, $location, $cookies){

  $scope.userLogin = function() {
    var loginDetails = {
      username: $scope.username
    };

    Auction.userLogin(loginDetails).then(function(res){
      $cookies.put('user', JSON.stringify(res));
      $location.path('/userBoard');
    }, function(err){
      console.log(err);
    });
  };

}]).controller('PopupCtrl', function($scope, $uibModalInstance, $http, auctionDialog) {
  $scope.auctionDialog = auctionDialog;
  $scope.initialBid = false;
  $scope.winningBid = false;
  $scope.ok = function() {
    $uibModalInstance.close($scope.auctionDialog);
  };
  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

}).controller('UserBoardCtrl', ['$scope', '$rootScope', 'Auction', '$cookies', '$uibModal', function($scope, $rootScope, Auction, $cookies, $uibModal) {
  $scope.userDetails = JSON.parse($cookies.get('user')).data.data;
  var userId = $scope.userDetails.id;

  $scope.getUserInventory = function() {
    Auction.getUserInventory(userId).then(function(res){
      $rootScope.userInventory = res.data.data;
    }, function(err){
      console.log(err);
    });
  };
  $scope.auctionDialog = {
    quantity: 1,
    minimumBid: 1
  };
  $rootScope.auctionDetails = {};

  $scope.auctionItem = function(type) {
    $uibModal.open({
      templateUrl : '/partials/popup.html',
      controller : 'PopupCtrl',
      resolve : {
        auctionDialog: {
          quantity: $scope.auctionDialog.quantity,
          minimumBid: $scope.auctionDialog.minimumBid
        }
      }
    }).result.then(function(result) {
      if (result > $rootScope.userInventory[type]){
        alert('invalid');
        $rootScope.auctionDetails = {};
      }
      $rootScope.auctionDetails = {
        name: type,
        quantity : result.quantity,
        minimumBid: result.minimumBid
      }
      $scope.initialBid = true;
    });
  };

  $scope.startAuction = false;

  $scope.$watch('auctionDetails', function(newObj, oldObj) {
    if(Object.keys(newObj).length != 0){
      $scope.startAuction = true;
    }
  }, true);


  $scope.placeBid = function() {
    console.log($scope.userBid);
    if($scope.userBid < $scope.auctionDialog.minimumBid){
      alert('error bid cannot be less than the minimumBid');
    }
    console.log($scope.userBid);
    $rootScope.auctionDetails.winningBid = $scope.userBid;
    $scope.winningBid = true;
    $scope.initialBid = false;

    console.log($rootScope.auctionDetails);
  }

}])
