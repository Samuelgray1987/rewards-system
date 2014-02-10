<?php

class Rewards extends Eloquent {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	public $timestamps = false;

	protected $table = 'rewards';

	protected $fillable = ['reflection', 'responsibility', 'reasoning', 'resourcefulness', 'resilience', 'respect', 'spent'];

}