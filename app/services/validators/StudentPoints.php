<?php

namespace Services\Validators;

class StudentPoints extends Validator {
	public static $rules = [
		'reflection' => 'required|numeric',
		'responsibility' => 'required|numeric',
		'reasoning' => 'required|numeric',
		'resourcefulness' => 'required|numeric',
		'resilience' => 'required|numeric',
		'respect' => 'required|numeric',
		'spent' => 'numeric'
	];		
}