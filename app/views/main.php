<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
	<meta charset="UTF-8">
	<title>Walbottle Campus - Rewards System</title>
	<!--Foundation CSS-->
	<link type="text/css" media="all" rel="stylesheet" href="css/foundation.min.css" />
	
	<!-- User CSS -->
	<link type="text/css" media="all" rel="stylesheet" href="css/style.css" />
	
	<!-- Foundation JS Dependencies -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src='./js/foundation.min.js'></script>
	
	<!-- Angular JS Dependencies -->
	<script src='./js/underscore.js'></script>
	<script src='./js/angular-file-upload-shim.min.js'></script>
	<script src='//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular.min.js'></script>
	<script src='//ajax.googleapis.com/ajax/libs/angularjs/1.2.11/angular-route.min.js'></script>
	<script src='./js/angular-sanitize.js'></script>
	<script src='./js/angular-file-upload.min.js'></script>
	
	<!-- AngularJS App Files -->
	<script src='./js/app.js'></script>
	<script>
		angular.module("app").constant("CSRF_TOKEN", '<?php echo csrf_token(); ?>');
	</script>
</head>
	<body>
		<nav ng-if="loggedIn" class="top-bar" data-topbar> 
			<ul class="title-area"> 
				<li class="name"> 
					<h1>
						<a href="#">Walbottle Campus - Rewards System</a>
					</h1> 
				</li> 
				<li class="toggle-topbar menu-icon">
					<a href="#">Menu</a>
				</li> 
			</ul> 
			<section class="top-bar-section"> 
				<!-- Right Nav Section --> 
				<ul class="right"> 
					<li class='has-dropdown'>  
						<a href="" >Rewards</a>
						<ul class='dropdown'>
							<li>
								<a ng-href="#/rewards">Rewards</a>
							</li>
							<li>
								<a ng-href="#/collected">Collected Rewards</a>
							</li>
						</ul>
					</li>
					
					<li>
						<a ng-href="#/home">Manage Students</a>
					</li>
					<li class='has-dropdown'>  
						<a href="" >Prizes</a>
						<ul class='dropdown'>
							<li>
								<a ng-href="#/prizes">Active Prizes</a>
							</li>
							<li>
								<a ng-href="#/prizes-deleted">Deleted Prizes</a>
							</li>  
							<li class="divider"></li>
							<li>
								<a ng-href="#/add-prize">Add Prize</a>
							</li>  
						</ul>
					</li>
					<li>
						<a ng-click="logout()">Logout</a>
					</li>  
				</ul> 
			</section> 
		</nav>

		<div class="row">	
			<div class="large-12 columns">
				<div id="flash" class="alert-box alert" ng-show="flash">
					{{ flash }}
					<i class="close" close>&times;</i>
				</div>
			</div>
			<div class="large-12 columns">
				<div id="message" class="alert-box success" ng-show="message">
					{{ message }}
					<i class="close" close>&times;</i>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="large-12 columns">
				<div id="view" ng-view></div>
			</div>	<!--.large-12 columns-->
		</div><!--.row-->
	</body>
</html>