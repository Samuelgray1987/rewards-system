<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
	<title>Angular App Test</title>
	{{ HTML::style('css/foundation.min.css')}}
</head>
<body>
<div class="row">
	<div class="large-12 columns">
		<h1>Rewards System</h1>
		<div id="view" ng-view></div>
	</div>	<!--.large-12 columns-->
</div><!--.row-->


{{ HTML::script('js/underscore.js') }}
{{ HTML::script('js/angular.js')}}
{{ HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.2.0rc1/angular-route.min.js') }}
{{ HTML::script('js/app.js') }}

</body>
</html>