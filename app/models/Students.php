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
			->leftJoin('student_reg_groups', 'user_11.UPN', '=', 'student_reg_groups.upn')
			->select('user_11.*',
								DB::raw('(rewards.reflection +  
										 rewards.responsibility + 
										 rewards.reasoning + 
										 rewards.resourcefulness +  
										 rewards.resilience + 
										 rewards.respect) AS total'),
								DB::raw('spent'),
								DB::raw('(rewards.reflection +  
										  rewards.responsibility +  
										  rewards.reasoning + 
  										  rewards.resourcefulness +  
										  rewards.resilience +  
										  rewards.respect - 
										  spent) AS grandtotal')
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