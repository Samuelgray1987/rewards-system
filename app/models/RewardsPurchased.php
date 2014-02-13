<?php

class RewardsPurchased extends Eloquent {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */

	protected $softDelete = true;

	protected $table = 'rewards_purchased';

	protected $guarded = ['id'];

	public function rewards() {
		return DB::table($this->table)
			->join('rewards_store_items', 'rewards_store_items.id', '=', 'rewards_purchased.rewards_store_id')
			->join('user_11', 'rewards_purchased.username', '=', 'user_11.username')
			->leftJoin('student_reg_groups', 'user_11.UPN', '=', 'student_reg_groups.upn')
			->select('user_11.forename', 
					'user_11.surname', 
					'user_11.yeargroup', 
					'user_11.username', 
					'student_reg_groups.reggroup',
					'rewards_store_items.points',
					'rewards_store_items.title',
					'rewards_purchased.id',
					'rewards_purchased.updated_at',
					'rewards_purchased.created_at')
			->whereNull('rewards_purchased.deleted_at')
			->get();
	} 
	public function rewardsCollected() {
		return DB::table($this->table)
			->join('rewards_store_items', 'rewards_store_items.id', '=', 'rewards_purchased.rewards_store_id')
			->join('user_11', 'rewards_purchased.username', '=', 'user_11.username')
			->leftJoin('student_reg_groups', 'user_11.UPN', '=', 'student_reg_groups.upn')
			->select('user_11.forename', 
					'user_11.surname', 
					'user_11.yeargroup', 
					'user_11.username', 
					'student_reg_groups.reggroup',
					'rewards_store_items.points',
					'rewards_store_items.title',
					'rewards_purchased.id',
					'rewards_purchased.deleted_at')
			->whereNotNull('rewards_purchased.deleted_at')
			->get();
	} 

}