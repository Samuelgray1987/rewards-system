<?php

class Students extends Eloquent {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'students';

	protected $hidden = ['password'];


}