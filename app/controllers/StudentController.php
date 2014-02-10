<?php

class StudentController extends BaseController {
	
	protected $students;

	protected $rewards;

	public function __construct(Students $students, Rewards $rewards) {
		$this->beforeFilter('auth');
		$this->students = $students;
		$this->rewards = $rewards;
	}

	public function getStudents() {
		return $this->students->studentsWithPoints();
	}
	public function getStudent() {
		try{
			if (!Input::get('student_id')) {
				throw new Exception("No student id found");
			}
			$student = Input::get('student_id');
		} catch (Exception $e) {
			return Response::json(['flash' => 'No student id found.' . $e], 500);
		}
		try {
			$studentData = $this->students->studentDetails($student);
			if (count($studentData) >= 1){
				return $studentData;
			}
			throw new Exception("No student data found");
		} catch (Exception $e) {
			return Response::json(['flash' => 'No user with that name is the database.'], 500);
		}

	}
	public function postUpdatepoints() {
		$validation = new Services\Validators\StudentPoints;
		if ($validation->passes())
		{
			try {
				$student = $this->rewards->where('upn', '=', Input::get('upn'));

				if(!$student) throw new Exception ("Error");

				return $student->update(['reflection' => Input::get('reflection'), 'responsibility' => Input::get('responsibility'),
					'reasoning' => Input::get('reasoning'), 
					'resourcefulness' => Input::get('resourcefulness'),
					'resilience' => Input::get('resilience'),
					'respect' => Input::get('respect'),
					'spent' => Input::get('spent') ]);				
			} catch (Exception $e) {
				return Response::json(['flash' => 'Error inputting data to database.'], 500);
			}
		}
		return Response::json(['flash' => 'Please ensure all values are entered correctly.' . $validation->errors], 500);
	}
}