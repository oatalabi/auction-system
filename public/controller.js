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

}).controller('UserBoardCtrl', ['$scope', '$rootScope', 'Auction', '$cookies', '$uibModal', '$firebaseObject', function($scope, $rootScope, Auction, $cookies, $uibModal, $firebaseObject) {

  var database = firebase.database();
  var ref = firebase.database().ref("auction").child("items");
  var obj = $firebaseObject(ref);
  $scope.startAuction = false;

  function init () {
    database.ref("auction").child("items").on("value", function(snapshot){
      $scope.currentBid = snapshot.val();
    });
  }
  init();

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
    minimumBid: 1,
    sellerId: $scope.userDetails.id,
    sellerName: $scope.userDetails.username
  };

  $rootScope.auctionDetails = {};
  $scope.auctionItem = function(type) {
    if($scope.currentBid){
      return alert('A bid is currently on going, try again later')
    }
    $uibModal.open({
      templateUrl : '/partials/popup.html',
      controller : 'PopupCtrl',
      resolve : {
        auctionDialog: {
          sellerId: $scope.userDetails.id,
          sellerName: $scope.userDetails.username,
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
        // id: "213456",
        name: type,
        quantity : result.quantity,
        minimumBid: result.minimumBid,
        winningBid: result.minimumBid,
        sellerId: $scope.userDetails.id,
        sellername: $scope.userDetails.username
      }
      Auction.registerBid($rootScope.auctionDetails);
      database.ref("auction").child("items").on('value', function(snapshot) {
        $scope.minBid = snapshot.val().minimumBid;
      });
      $scope.initialBid = true;
    });
  };

  $scope.placeBid = function(userBid) {
    if(userBid < $scope.currentBid.winningBid){
      alert('error bid cannot be less than the minimumBid');
    } else {
      Auction.updateBid(userBid);
      database.ref("auction").child("items").on('value', function(snapshot) {
        $scope.currentBid = snapshot.val();
      });
    }
  };

  $scope.$watch('auctionDetails', function(newObj, oldObj) {
    if(Object.keys(newObj).length != 0){
      $scope.startAuction = true;
    }
  }, true);

  // var firebaseObj = new Firebase("https://auction-game-e0f1e.firebaseio.com");

}])
