<?php

class RewardsController extends BaseController {

	protected $rewardsPurchased;

	public function __construct(RewardsPurchased $rewardsPurchased)
	{
		$this->beforeFilter('auth');
		$this->rewardsPurchased = $rewardsPurchased;
	}

	public function getIndex()
	{
		return $this->rewardsPurchased->rewards();
	}
	public function getCollected()
	{
		return $this->rewardsPurchased->rewardsCollected();
	}
	public function postDelete()
	{
		$id = Input::all();
		$id = $id[0];
		try {
			if($id) return $this->rewardsPurchased->where('id', '=', $id)->delete();
			throw new Exception ("Missing ID");
		} catch (Exception $e) {
			Response::json(['flash' => "Deletion not complete please contact a member of staff"], 500);
		} 
	}
}