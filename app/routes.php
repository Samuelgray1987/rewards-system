<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', 'HomeController@getIndex');
Route::controller('auth', 'AuthController');
Route::controller('students', 'StudentController');
Route::get('/expiry', function() {
	return Response::json(['flash' => 'Logged in successfully']);
	#return Response::json(['flash' =>'Session expired, please log in.'], 401);
});