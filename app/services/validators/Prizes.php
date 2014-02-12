<?php

namespace Services\Validators;

class Prizes extends Validator {
	public static $rules = [
		'title' => 'required',
		'points' => 'required|numeric',
		'yeargroup' => 'required'
	];		
}