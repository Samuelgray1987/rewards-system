<?php

class StudentsTableSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$students = [
			[
				'upn' => 'SGY',
				'username' => '54899',
				'firstname' => 'Samuel',
				'lastname' => 'Gray',
				'yeargroup' => 10,
				'password' => Hash::make('walbottle')
			],
			[
				'upn' => 'MHP',
				'username' => '1564',
				'firstname' => 'Michael',
				'lastname' => 'Heslop',
				'yeargroup' => 9,
				'password' => Hash::make('walbottle')
			],
			[
				'upn' => 'GPY',
				'username' => '655465',
				'firstname' => 'Graeme',
				'lastname' => 'Porter',
				'yeargroup' => 7,
				'password' => Hash::make('walbottle')
			],
			[
				'upn' => 'MBE',
				'username' => '21324165',
				'firstname' => 'Michael',
				'lastname' => 'Boyle',
				'yeargroup' => 12,
				'password' => Hash::make('walbottle')
			]
		];

		foreach ($students as $student)
		{
			DB::table('students')->insert($student);
		}
	}

}