<?php

class HomeController extends BaseController {

	protected $layout = "main";

	public function getIndex()
	{
		return View::make('main');
	}

}