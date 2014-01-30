<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
	<title>Angular App Test</title>
	<link type="text/css" media="all" rel="stylesheet" href="css/foundation.min.css" />
	<script src='js/underscore.js'></script>
	<script src='js/angular.js'></script>
	<script src='https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-route.min.js'></script>
	<script src='js/app.js'></script>
</head>
<body>
	<div class="row">	
		<div class="large-12 columns">
			<div id="flash" class="alert-box alert" ng-show="flash">
				{{ flash }}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="large-12 columns">
			<h1>Rewards System</h1>
			<div id="view" ng-view></div>
		</div>	<!--.large-12 columns-->
	</div><!--.row-->

</body>
</html>