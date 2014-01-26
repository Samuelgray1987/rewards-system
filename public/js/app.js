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

app.factory("AuthenticationService", function( $http, $location ) {


	return {
		login: function(credentials) {
			return $http.post("auth/login", credentials);
		},
		logout: function() {
			$http.get("auth/logout");
		}
	}
});

app.controller('LoginController', function(AuthenticationService, $scope){
	$scope.credentials = {email: "", password: ""};

	$scope.login = function() {
		AuthenticationService.login($scope.credentials);
	};
});


app.controller('HomeController', function(AuthenticationService, $scope){

	$scope.title = "Home";
	$scope.message = "Mouse over to see directive";
	$scope.logout = function() {
		AuthenticationService.logout();
	};
});

app.directive("showsMessageWhenHovered", function(){
	return {
		restrict: "A", // A = Attribute, C = Class name, E = Element, M = HTML Comment
		link: function (scope, element, attributes){
			var originalMessage = scope.message;
			element.bind("mouseover", function() {
				scope.message = attributes.message;
				scope.$apply();
			});
			element.bind("mouseout", function(){
				scope.message = originalMessage;
				scope.$apply();
			});
		}
	};
});