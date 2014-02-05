<?php

class StudentController extends BaseController {
	
	protected $students;

	public function __construct(Students $students) {
		$this->students = $students;
		$this->beforeFilter('auth');
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
}