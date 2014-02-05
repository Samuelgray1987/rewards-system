<?php

class Students extends Eloquent {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user_11';

	protected $hidden = ['password'];

	public function studentsWithPoints() {
		return DB::table($this->table)
			->join('rewards', 'user_11.UPN', '=', 'rewards.upn')
			->select('user_11.forename', 'user_11.surname', 'user_11.UPN', 'user_11.username',
											DB::raw('CAST(user_11.yeargroup AS UNSIGNED) AS yeargroup'),
											DB::raw('(CAST(rewards.reflection AS UNSIGNED) +  
											CAST(rewards.responsibility AS UNSIGNED) +  
											CAST(rewards.reasoning AS UNSIGNED) + 
											CAST(rewards.resourcefulness AS UNSIGNED) +  
											CAST(rewards.resilience AS UNSIGNED) + 
											CAST(rewards.respect AS UNSIGNED)) AS total'),
								  	DB::raw('CAST(spent AS UNSIGNED) AS spent'),
								 	DB::raw('((CAST(rewards.reflection AS UNSIGNED) +  
											 CAST(rewards.responsibility AS UNSIGNED) +  
											 CAST(rewards.reasoning AS UNSIGNED) + 
											 CAST(rewards.resourcefulness AS UNSIGNED) +  
											 CAST(rewards.resilience AS UNSIGNED) + 
											 CAST(rewards.respect AS UNSIGNED)) - CAST(spent AS UNSIGNED)) AS grandtotal')
								)
			->where('group', '=', 'Student')
			->get();
	}
	public function studentDetails($username) {
		return DB::table($this->table)
						->join('rewards', 'user_11.UPN', '=', 'rewards.upn')
						->select('rewards.*', 'user_11.*')
						->where('user_11.username', '=', $username)
						->get();
	}
}