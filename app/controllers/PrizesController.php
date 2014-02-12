<?php

class PrizesController extends BaseController {

	protected $prizes;

	public function __construct(Prizes $prizes)
	{
		$this->beforeFilter('auth');
		$this->prizes = $prizes;
	}

	public function getIndex()
	{
		return $this->prizes->orderBy('created_at', 'DESC')->get();
	}
	public function getDeleted()
	{
		return $this->prizes->onlyTrashed()->orderBy('created_at', 'DESC')->get();
	}
	public function getPrize()
	{
		try{
			if (!Input::get('prize_id')) {
				throw new Exception("No prize id found");
			}
			$prize = Input::get('prize_id');
		} catch (Exception $e) {
			return Response::json(['flash' => 'No prize id found.' . $e], 500);
		}
		try {
			$prizeData = $this->prizes->find($prize);
			if (count($prizeData) >= 1){
				return $prizeData;
			}
			throw new Exception("No prize data found");
		} catch (Exception $e) {
			return Response::json(['flash' => 'No prize with that id is the database.'], 500);
		}
	}
	public function postUpload() {
		$date = new DateTime();
		$filepath = 'public/uploads/prizes/';
		$filename = $date->format('U') . Input::file('file')->getClientOriginalName();
		$image = Image::make( Input::file('file')->getRealPath())
												 ->resize(1000, 1000)
												 ->save($filepath . $filename );
		$downloadpath = 'uploads/prizes/';
		return Response::json(['image' => $downloadpath . $filename]);
	}
	public function postUpdateprize() {
		$validator = new Services\Validators\Prizes;

		if ($validator->passes())
		{
			return $this->prizes->where('id', '=', Input::get('id'))->update(Input::all());
		} else {
			return Response::json(['flash' => 'Error updating prize.' . $validator->errors], 500);
		}

		return Response::json(['flash' => 'Error receiving validation.'], 500);

	}
	public function postAdd() {
		$validator = new Services\Validators\Prizes;

		if ($validator->passes())
		{
			try{
				if ( $this->prizes->insert(Input::all()) ) return Response::json(['flash' => 'Success']);
				throw new Exception ("Database error");
			} catch (Exception $e) {
				return Response::json(['flash' => 'Database insertion error.' . $validator->errors], 500);
			}
		} else {
			return Response::json(['flash' => 'Error inserting prize.' . $validator->errors], 500);
		}

		return Response::json(['flash' => 'Error receiving validation.'], 500);

	}
	public function postDelete()
	{
		$id = Input::all();
		$id = $id[0];
		try {
			if($id) return $this->prizes->where('id', '=', $id)->delete();
			throw new Exception ("Missing ID");
		} catch (Exception $e) {
			Response::json(['flash' => "Deletion not complete please contact a member of staff"], 500);
		} 
	}
	public function postRestore()
	{
		$id = Input::all();
		$id = $id[0];

		try {
			if($id) return $this->prizes->withTrashed()->where('id', '=', $id)->restore();
			throw new Exception ("Missing ID");
		} catch (Exception $e) {
			Response::json(['flash' => "Restore not complete please contact a member of staff"], 500);
		} 
	}
}