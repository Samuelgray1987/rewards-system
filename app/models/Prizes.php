<?php

class Prizes extends Eloquent {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */

	protected $softDelete = true;

	protected $table = 'rewards_store_items';

	protected $guarded = ['id'];

}