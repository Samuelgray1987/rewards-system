<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRewardsStoreItems extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('rewards_store_items', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('title');
			$table->string('image_name')->nullable();
			$table->text('description')->nullable();
			$table->integer('points');
			$table->string('yeargroup');
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
		Schema::dropIfExists('rewards_store_items');
	}

}
