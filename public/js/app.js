//Setter
var app = angular.module("app", ['ngRoute', 'ngSanitize', 'angularFileUpload']);

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
  			return $http.get('./expiry');
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
  			return $http.get('./expiry');
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
  $routeProvider.when('/collected', {
  	templateUrl: 'templates/collected.html',
  	controller: 'CollectedController',
  	resolve: {
  			rewards: function(RewardsService) {
  				return RewardsService.getCollected();
  			}
  		}
  });
  $routeProvider.when('/prizes', {
  	templateUrl: 'templates/prizes.html',
  	controller: 'PrizesController',
  	resolve: {
  			prizes: function(PrizesService) {
  				return PrizesService.get();
  			}
  		}
  });
  $routeProvider.when('/prizes-deleted', {
  	templateUrl: 'templates/prizes-deleted.html',
  	controller: 'PrizesDeletedController',
  	resolve: {
  			prizes: function(PrizesService) {
  				return PrizesService.getDeleted();
  			}
  		}
  });
  $routeProvider.when('/edit-prize/:prize_id', {
  	templateUrl: 'templates/edit-prize.html',
  	controller: 'ManagePrizeController',
  	resolve: {
  			prize: function(PrizesService) {
  				return PrizesService.getIndividualPrize();
  			}
  		}
  });
  $routeProvider.when('/add-prize', {
  	templateUrl: 'templates/edit-prize.html',
  	controller: 'AddPrizeController'
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

	var restrictedRoutes = ['/home', '/manage_student', '/rewards', '/collected', 'prizes', '/edit-prize'];

	$(document).foundation();

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
			return $http.get("./students/students");
		},
		getIndividualStudent: function() {
			var student = $http.get("./students/student?student_id=" + $route.current.params.student_id);
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
			return $http.get("./rewards/index");
		},
		getCollected: function() {
			return $http.get("./rewards/collected");
		}

	}
});

app.factory("PrizesService", function($http, $location,$route, FlashService){
	var prizesError = function(response){
		FlashService.show(response.flash);
	};

	return {
		get: function() {
			return $http.get("./prizes/index");
		},
		getDeleted: function() {
			return $http.get("./prizes/deleted");
		},
		getIndividualPrize: function() {
			var prize = $http.get("./prizes/prize?prize_id=" + $route.current.params.prize_id);
			prize.success(FlashService.clear);
			prize.error(prizesError);
			return prize;
		}

	}
});

app.factory("FlashService", function($rootScope, $timeout){
	return {
		show: function(message) {
			$rootScope.flash = message;
			$timeout(function(){
				$rootScope.flash = "";
			}, 5000);
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
			var login = $http.post("./auth/login", sanitizeCredentials(credentials));
			login.success(cacheSession);
			login.success(FlashService.clear);
			login.error(loginError);
			return login;
		},
		logout: function() {
			var logout = $http.get("./auth/logout");
			logout.success(uncacheSession);
			LoggedInProof.loggedOut();
			return logout;
		},
		isLoggedIn: function() {
			return SessionService.get('authenticated');
		}
	}
});

app.factory("FormPostingService", function($http, $rootScope, $timeout, FlashService){
	var postError = function(response) {
		FlashService.show(response.flash);
	};

	return {
		postForm : function(url, data, message) {
			var dataToSend = $http.post(url, data);
			dataToSend.success(function(){
				$rootScope.message = message;
				$timeout(function(){
					FlashService.clearMessage();
				}, 5000)
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

app.controller('PrizesController', function (AuthenticationService, $scope, $location, prizes, FormPostingService, $upload) {
	$scope.title = "Prizes Available";
	angular.forEach(prizes.data, function(data){
		data.points = parseFloat(data.points);
		data.show = true;
	});
	$scope.prizes = prizes.data;

	$scope.delete = function(id, prize, index) {
		FormPostingService.postForm("./prizes/delete", id, "Prize removed.");
		$scope.prizes.splice(index, 1);
		return prize.show = false;
	};

	$scope.logout = function() {
		AuthenticationService.logout().success(function(){
			alert('click');
			$location.path('/login');
		});
	}
});

app.controller('PrizesDeletedController', function (AuthenticationService, $scope, $location, prizes, FormPostingService, $upload) {
	$scope.title = "Prizes Deleted";
	angular.forEach(prizes.data, function(data){
		data.points = parseFloat(data.points);
		data.show = true;
	});
	$scope.prizes = prizes.data;

	$scope.restore = function(id, prize, index) {
		FormPostingService.postForm("./prizes/restore", id, "Prize restored.");
		$scope.prizes.splice(index, 1);
		return prize.show = false;
	};

	$scope.logout = function() {
		AuthenticationService.logout().success(function(){
			alert('click');
			$location.path('/login');
		});
	}
});

app.controller('ManagePrizeController', function(AuthenticationService, FlashService, $scope, $upload, $rootScope, prize, FormPostingService, $route){
	$scope.title = "Manage Prize ";
	$scope.prize = prize.data;

	$scope.onFileSelect = function($files) {
	//$files: an array of files selected, each file has name, size, and type.
		for (var i = 0; i < $files.length; i++) {
		  var file = $files[i];
		  	$scope.upload = $upload.upload({
		        url: './prizes/upload', //upload.php script, node.js route, or servlet url
		        method: 'POST',
		        data: {myObj: $scope.myModelObj},
		        file: file
		      }).progress(function(evt) {
		        $scope.percent = 'Uploaded: ' + parseInt(100.0 * evt.loaded / evt.total) + '%';
		        $scope.apply();
		      }).success(function(data, status, headers, config) {
		        $scope.prize.image_name = data['image'];
		      });
		  }
		$scope.$apply();
	}

	$scope.update = function() {
		FormPostingService.postForm("./prizes/updateprize", $scope.prize, "Prize successfully edited.").success(function(){
		});
	}

	$rootScope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	};
});

app.controller('AddPrizeController', function(AuthenticationService, FlashService, $location, $scope, $upload, $rootScope, FormPostingService, $route){
	var prize = {};
	prize.data = { "image_name" : ""};
	$scope.button = "Add";
	$scope.title = "Manage Prize ";
	$scope.prize = prize.data;

	$scope.onFileSelect = function($files) {
	//$files: an array of files selected, each file has name, size, and type.
		for (var i = 0; i < $files.length; i++) {
		  var file = $files[i];
		  	$scope.upload = $upload.upload({
		        url: './prizes/upload', //upload.php script, node.js route, or servlet url
		        method: 'POST',
		        data: {myObj: $scope.myModelObj},
		        file: file
		      }).progress(function(evt) {
		        $scope.percent = 'percent: ' + parseInt(100.0 * evt.loaded / evt.total) + '%';
		        console.log($scope);
		      }).success(function(data, status, headers, config) {
		        $scope.prize.image_name = data['image'];
		      });
		  }
		$scope.$apply();
	}

	$scope.update = function() {
		FormPostingService.postForm("./prizes/add", $scope.prize, "Prize successfully added.").success(function(){
			$location.path('/prizes');
		});
	}

	$rootScope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
	};
});

app.controller('RewardsController', function (AuthenticationService, $scope, $location, rewards, FormPostingService) {
	$scope.title = "Student Rewards - Not Collected";
	angular.forEach(rewards.data, function(data){
		data.yeargroup = parseFloat(data.yeargroup);
		data.points = parseFloat(data.points);
		data.show = true;
	});
	$scope.rewards = rewards.data;

	$scope.collected = function(id, reward, index) {
		FormPostingService.postForm("./rewards/delete", id, "Item marked as collected.");
		$scope.rewards.splice(index, 1);
		return reward.show = false;
	};

	$scope.logout = function() {
		AuthenticationService.logout().success(function(){
			alert('click');
			$location.path('/login');
		});
	}
});

app.controller('CollectedController', function (AuthenticationService, $scope, $location, rewards, FormPostingService) {
	$scope.title = "Student Rewards - Collected";
	angular.forEach(rewards.data, function(data){
		data.yeargroup = parseFloat(data.yeargroup);
		data.points = parseFloat(data.points);
		data.show = true;
	});
	$scope.rewards = rewards.data;

	$scope.collected = function(id, reward) {
		FormPostingService.postForm("./rewards/delete", id, "Item marked as collected.");
		return reward.show = false;
	};

	$scope.logout = function() {
		AuthenticationService.logout().success(function(){
			$location.path('/login');
		});
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

app.controller('LoginController', function(AuthenticationService, $scope, $location, $rootScope, sessionDataService){
	$scope.credentials = {username: "", password: ""};

	$scope.login = function() {
		AuthenticationService.login($scope.credentials).success(function(data){
			//Cache some session data, including user group
			sessionDataService.cacheSession(data);

			if ( data.group != "Student" ) {
				$location.path('/rewards');
			} else {
				AuthenticationService.logout().success(function(){
					$location.path('/login');
				});
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
	$scope.title = "All Students";
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

	angular.forEach(student.data, function(data)
	{
		data.reflection 		= parseFloat(data.reflection);
		data.resilience 		= parseFloat(data.resilience);
		data.resourcefulness 	= parseFloat(data.resourcefulness);
		data.respect 			= parseFloat(data.respect);
		data.responsibility	 	= parseFloat(data.responsibility);
		data.reasoning 			= parseFloat(data.reasoning);
		data.spent 				= parseFloat(data.spent);
	});


	$scope.update = function() {
		FormPostingService.postForm("./students/updatepoints", $scope.student, "Student successfully edited.").success(function(){
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
app.directive('loading', function($http){
	return {
		restrict: 'A',
		link: function (scope, element, attributes){
			scope.isLoading = function() {
				return $http.pendingRequests.length > 0;
			};
			scope.$watch(scope.isLoading, function(v)
			{
				if (v){
					element.show();
				} else {
					element.hide();
				}
			});
		}
	}
});
/*
 *
 * @Filter
 *
 */
//Returns points as £ value.
app.filter('sumByKey', function() {
	return function(data, key){
		if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
			return 0;
		}
		var sum = 0;

		angular.forEach(data, function(d){
			sum += parseInt(d[key]);
		});
		return sum / 20;
	};
});
//Returns a sum as a definitive number
app.filter('sumByKeyTotal', function() {
	return function(data, key){
		if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
			return 0;
		}
		var sum = 0;

		angular.forEach(data, function(d){
			sum += parseInt(d[key]);
		});
		return sum;
	};
});