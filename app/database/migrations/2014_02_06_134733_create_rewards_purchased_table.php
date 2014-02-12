<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRewardsPurchasedTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('rewards_purchased', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('username');
			$table->integer('rewards_store_id');
			$table->integer('points');
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('rewards_purchased');
	}

}
