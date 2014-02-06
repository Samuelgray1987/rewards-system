<?php

class RewardsController extends BaseController {

	protected $rewards;

	public function __construct(Rewards $rewards)
	{
		$this->beforeFilter('auth');
		$this->rewards = $rewards;
	}

	public function getIndex()
	{
		return $this->rewards->get()->toJson();
	}
}