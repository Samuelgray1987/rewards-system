<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRewardsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('rewards', function(Blueprint $table)
		{
			$table->string('upn')->unique();
			$table->integer('reflection')->nullable();
			$table->integer('responsibility')->nullable();
			$table->integer('reasoning')->nullable();
			$table->integer('resourcefulness')->nullable();
			$table->integer('resilience')->nullable();
			$table->integer('respect')->nullable();
			$table->integer('spent')->nullable();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('rewards');
	}

}
