//Setter
var app = angular.module("app", ['ngRoute', 'ngSanitize']);

/*
 *
 * Routes
 *
 */

app.config(function($routeProvider) {

  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/home', {
  	templateUrl: 'templates/home.html',
  	controller: 'HomeController',
  	resolve : {
  		expiry : function($http) {
  			return $http.get('/expiry');
  		},
  		students : function(StudentService){
  			return StudentService.get();
  		}

  	}
  });
  $routeProvider.when('/student-home', {
  	templateUrl: 'templates/student-home.html',
  	controller: 'StudentHomeController',
  	resolve: {
  		expiry: function($http) {
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


/*
 *
 * 401 Errors
 *
 */


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

/*
 *
 * Access Control
 *
 */


app.run(function($rootScope, $location, AuthenticationService, FlashService, LoggedInProof){

	var routesThatDontRequireAuth = ['/login'];

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (!_(routesThatDontRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn())
		{
			LoggedInProof.loggedOut();
			$location.path('/login');
			FlashService.show("Please login to continue");
		}
		if (AuthenticationService.isLoggedIn())
		{
			return LoggedInProof.loggedIn('authenticated');
		}
	});

})

/*
 *
 * Factories
 *
 */

app.factory("LoggedInProof", function($rootScope, SessionService){
	return {
		loggedIn: function(key){
			return $rootScope.loggedIn = true;
		},
		loggedOut: function(){
			return $rootScope.loggedIn = false;
		}
	}
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

app.factory("AuthenticationService", function( SessionService, $http, $location, $sanitize, FlashService, CSRF_TOKEN, LoggedInProof ) {

	var cacheSession = function() {
		SessionService.set("authenticated", true);
	};
	var uncacheSession = function() {
		SessionService.unset("authenticated");
	};
	var loginError = function(response) {
		FlashService.show(response.flash);
	};

	var sanitizeCredentials = function(credentials) {
		 return {
		 	username: $sanitize(credentials.username),
		 	password: $sanitize(credentials.password),
		 	csrf_token:  CSRF_TOKEN
		 }
	};

	return {
		login: function(credentials) {
			var login = $http.post("auth/login", sanitizeCredentials(credentials));
			login.success(cacheSession);
			login.success(FlashService.clear);
			login.error(loginError);
			return login;
		},
		logout: function() {
			var logout = $http.get("auth/logout");
			logout.success(uncacheSession);
			LoggedInProof.loggedOut();
			return logout;
		},
		isLoggedIn: function() {
			return SessionService.get('authenticated');
		}
	}
});

app.factory("sessionDataService", function() {
	return {
		cacheSession: function(sessionArray) {
			console.log("caching" + sessionArray);
		}
	}

});

/*
 *
 * Controllers
 *
 */

app.controller('StudentsController', function (AuthenticationService, FlashService, $scope, $location, students){
	$scope.title = "Students";
	$scope.students = students;

	
	$scope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	}
});

app.controller('LoginController', function(AuthenticationService, $scope, $location, $rootScope, sessionDataService){
	$scope.credentials = {username: "", password: ""};

	$scope.login = function() {
		AuthenticationService.login($scope.credentials).success(function(data){
			//Cache some session data, including user group
			sessionDataService.cacheSession(data);

			if ( data.group == "Student" ) {
				$location.path('/home');
			} else {
				$location.path('/student-home');
			}
		});
	};

	$rootScope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	};
});


app.controller('HomeController', function(AuthenticationService, FlashService, $scope, $rootScope, $location, expiry, students){
	$scope.title = "Rewards Home";
	$scope.message = "Mouse over to see directive";
	$scope.students = students.data;

	$scope.expiry = expiry.data;

	$rootScope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	};
});

app.controller('StudentHomeController', function(AuthenticationService, FlashService, $scope, $rootScope, $location, expiry){
	$scope.title = "Rewards Home Students";
	$scope.message = "Mouse over to see directive";

	$scope.expiry = expiry.data;

	$rootScope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	};
});

/*
 *
 * Directives
 *
 */

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