<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUser11Table extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user_11', function(Blueprint $table)
		{
			$table->string('UPN')->unique();
			$table->string('adno');
			$table->string('username')->unique();
			$table->string('title');
			$table->string('forename');
			$table->string('surname');
			$table->string('group');
			$table->string('staff_subject');
			$table->integer('yeargroup');
			$table->string('clubs');
			$table->string('smartupn');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('user_11');
	}

}
