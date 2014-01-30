<?php

class StudentController extends BaseController {
	
	protected $students;

	public function __construct(Students $students) {
		$this->students = $students;
	}

	public function getStudents() {
		return $this->students->get()->toJson();
	}

}