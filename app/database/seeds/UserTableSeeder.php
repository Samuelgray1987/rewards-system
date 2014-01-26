<?php

class UserTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$users = [
			[
				'firstname' => 'Samuel',
				'lastname' => 'Gray',
				'email' => 'samuelgray1987@gmail.com',
				'username' => 'Samuelgray1987',
				'password' => Hash::make('345564')
			]
		];

		foreach ($users as $user)
		{
			DB::table('users')->insert($user);
		}
	}

}