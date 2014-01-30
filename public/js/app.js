//Setter
var app = angular.module("app", ['ngRoute']);

app.config(function($routeProvider) {

  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/home', {
  	templateUrl: 'templates/home.html',
  	controller: 'HomeController',
  	resolve : {
  		"expiry" : function($http) {
  			return $http.get('/expiry');
  		}
  	}
  });

  $routeProvider.when('/students' , {
  	templateUrl: 'templates/students.html',
  	controller: 'StudentsController',
  	resolve: {
  		students : function(StudentService) {
  			return StudentService.get();
  		}
  	}
  });

  $routeProvider.otherwise ({ redirectTo: '/login'});

});

app.config(function($httpProvider) {

	var logsOutUserOn401 = function($location, $q, SessionService, FlashService) {
		var success = function(response) {
			return response;
		};
		var error = function(response) {
			if (response.status === 401) {
				SessionService.unset('authenticated');
				FlashService.show(response.data.flash);
				$location.path('/login');
				return $q.reject(response);
			} else {
				return $q.reject(response);
			}
		};
		return function(promise) {
			return promise.then(success, error);
		};
	};


	$httpProvider.responseInterceptors.push(logsOutUserOn401);

});

//access control
app.run(function($rootScope, $location, AuthenticationService, FlashService){

	var routesThatDontRequireAuth = ['/login'];

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (!_(routesThatDontRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn())
		{
			$location.path('/login');
			FlashService.show("Please login to continue");
		}
	});

})

app.factory("StudentService", function($http){
	return {
		get: function() {
			return $http.get("/students/students")
		}
	}
});

app.factory("FlashService", function($rootScope){
	return {
		show: function(message) {
			$rootScope.flash = message;
		},
		clear: function(){
			$rootScope.flash = "";
		}
	}
})

app.factory("SessionService", function(){
	return {
		get: function(key) {
			return sessionStorage.getItem(key);
		},
		set: function(key, val) {
			return sessionStorage.setItem(key, val);
		},
		unset: function(key) {
			return sessionStorage.removeItem(key);
		}
	}
})

app.factory("AuthenticationService", function( SessionService, $http, $location, FlashService ) {

	var cacheSession = function() {
		SessionService.set("authenticated", true);
	};
	var uncacheSession = function() {
		SessionService.unset("authenticated");
	};
	var loginError = function(response) {
		FlashService.show(response.flash);
	};

	return {
		login: function(credentials) {
			var login = $http.post("auth/login", credentials);
			login.success(cacheSession);
			login.success(FlashService.clear);
			login.error(loginError);
			return login;
		},
		logout: function() {
			var logout = $http.get("auth/logout");
			logout.success(uncacheSession);
			return logout;
		},
		isLoggedIn: function() {
			return SessionService.get('authenticated');
		}
	}
});

app.controller('StudentsController', function (AuthenticationService, FlashService, $scope, $location, students){
	$scope.title = "Students";
	$scope.students = students;

	
	$scope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	}
});

app.controller('LoginController', function(AuthenticationService, $scope, $location){
	$scope.credentials = {username: "", password: ""};

	$scope.login = function() {
		AuthenticationService.login($scope.credentials).success(function(){
			$location.path('/home');
		});
	};
});


app.controller('HomeController', function(AuthenticationService, FlashService, $scope, $location, expiry){
	$scope.title = "Home";
	$scope.message = "Mouse over to see directive";
	
	$scope.expiry = expiry.data;

	$scope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
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