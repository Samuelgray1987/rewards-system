<?php

class RewardsPurchasedSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$date = new \DateTime;

		$purchases = [
			[
				'username' => 'SB170',
				'rewards_store_id' => 14,
				'points' => 2000,
				'created_at' => $date,
				'updated_at' => $date
			],
			[
				'username' => 'WF6',
				'rewards_store_id' => 15,
				'points' => 1000,
				'created_at' => $date,
				'updated_at' => $date
			],
			[
				'username' => 'SB170',
				'rewards_store_id' => 16,
				'points' => 200,
				'created_at' => $date,
				'updated_at' => $date
			],
			[
				'username' => 'RC181',
				'rewards_store_id' => 17,
				'points' => 500,
				'created_at' => $date,
				'updated_at' => $date
			],
			[
				'username' => 'KB173',
				'rewards_store_id' => 18,
				'points' => 1200,
				'created_at' => $date,
				'updated_at' => $date
			],
			[
				'username' => 'GI6',
				'rewards_store_id' => 19,
				'points' => 745,
				'created_at' => $date,
				'updated_at' => $date
			]
			
		];

		foreach ($purchases as $purchase)
		{
			DB::table('rewards_purchased')->insert($purchase);
		}
	}

}