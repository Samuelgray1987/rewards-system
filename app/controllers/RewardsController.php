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
}