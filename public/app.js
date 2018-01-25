var app = angular.module('AuctionApp', ['ngRoute', 'ngCookies', 'ui.bootstrap', 'firebase']);

app.config(function($routeProvider) {

  $routeProvider.when('/', {
    templateUrl: 'partials/login.html',
    controller: 'AuctionCtrl'
  }).
  when('/home', {
    templateUrl: 'index.html',
    controller: 'AuctionCtrl'
  }).
  when('/userBoard', {
    templateUrl: 'partials/user_board.html',
    controller: 'UserBoardCtrl'
  }).
  otherwise({
    redirectTo: '/home'
  });
});