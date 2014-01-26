//Setter
var app = angular.module("app", ['ngRoute']);

app.config(function($routeProvider) {

  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/home', {
  	templateUrl: 'templates/home.html',
  	controller: 'HomeController'
  });

  $routeProvider.otherwise ({ redirectTo: '/login'});

});

app.controller('LoginController', function($scope){
	var credentials = $scope.credentials;
	console.log(credentials);
});


app.controller('HomeController', function(){

});
