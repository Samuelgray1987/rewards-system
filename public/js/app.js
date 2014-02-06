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
  $routeProvider.when('/manage_student/:student_id', {
  	templateUrl: 'templates/manage-student.html',
  	controller: 'ManageStudentController',
  	resolve: {
  		student: function(StudentService) {
  			return StudentService.getIndividualStudent();
  		}
  	}
   });
  $routeProvider.when('/rewards', {
  	templateUrl: 'templates/rewards.html',
  	controller: 'RewardsController',
  	resolve: {
  			rewards: function(RewardsService) {
  				return RewardsService.get();
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


app.run(function($rootScope, $location, AuthenticationService, FlashService, LoggedInProof, SessionService){

	var routesThatDontRequireAuth = ['/login'];

	var restrictedRoutes = ['/home', '/manage_student'];

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (!_(routesThatDontRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn())
		{
			LoggedInProof.loggedOut();
			$location.path('/login');
			FlashService.show("Please login to continue");
		}
		if (AuthenticationService.isLoggedIn())
		{
			LoggedInProof.loggedIn('authenticated');
		}
		//If the user is a student, restrict routes.
		if (_(restrictedRoutes).contains($location.path()) && SessionService.get("group") == "Student" )
		{
			$location.path('/login');
			FlashService.show('Unpermitted area, please login.');
		}
		//Any global clears.
		FlashService.clearMessage();

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

app.factory("StudentService", function($http, $location,$route, FlashService){
	var studentError = function(response){
		FlashService.show(response.flash);
	};

	return {
		get: function() {
			return $http.get("/students/students");
		},
		getIndividualStudent: function() {
			var student = $http.get("/students/student?student_id=" + $route.current.params.student_id);
			student.success(FlashService.clear);
			student.error(studentError);
			return student;
		}

	}
});

app.factory("RewardsService", function($http, $location,$route, FlashService){
	var rewardError = function(response){
		FlashService.show(response.flash);
	};

	return {
		get: function() {
			return $http.get("/rewards/index");
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
		},
		showMessage: function(message) {
			$rootScope.message = message;
		},
		clearMessage: function() {
			$rootScope.message = "";
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
		SessionService.unset("group");
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

app.factory("FormPostingService", function($http, $rootScope, FlashService){
	var postError = function(response) {
		FlashService.show(response.flash);
	};

	return {
		postForm : function(url, data) {
			var dataToSend = $http.post(url, data);
			dataToSend.success(function(){
				$rootScope.message = "Students details updated."
			});
			dataToSend.error(postError);
			return dataToSend;
		}
	}
});

app.factory("sessionDataService", function(SessionService) {
	return {
		cacheSession: function(sessionArray) {
			SessionService.set("group", sessionArray.group);
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

			if ( data.group != "Student" ) {
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
	angular.forEach(students.data, function(data){
		data.yeargroup = parseFloat(data.yeargroup);
		data.spent = parseFloat(data.spent);
		data.total = parseFloat(data.total);
		data.grandtotal = parseFloat(data.grandtotal);
	});
	$scope.students = students.data;
	
	$scope.expiry = expiry.data;

	$rootScope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	};
});

app.controller('ManageStudentController', function(AuthenticationService, FlashService, $scope, $rootScope, student, FormPostingService, $route){
	$scope.title = "Manage Student ";
	$scope.student = student.data[0];


	$scope.update = function() {
		FormPostingService.postForm("students/updatepoints", $scope.student).success(function(){
		});
	}

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

app.directive("close", function() {
	return{
		restrict: "A",
		link: function(scope, element, attributes){
			element.bind("click", function() {
			});
		}
	}
})