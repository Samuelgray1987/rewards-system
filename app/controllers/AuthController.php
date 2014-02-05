<?php

class AuthController extends BaseController {

	protected $adauth;

	protected $username;

	protected $password;

	protected $user;

	public function __construct(Services\Auth\Ldap\adLDAP $adauth, User $user)
	{
		$this->adauth = $adauth;
		$this->user = $user;

		$this->username = Input::json('username');
		$this->password = Input::json('password');

		$this->beforeFilter('csrf_json', ["only" => ["postLogin"]]);
	}

	public function postLogin()
	{
		try 
		{
			$adldap = new $this->adauth;
		}
		catch (adLDAPException $e)
		{
			return Response::json(['flash' => 'Incorrect adLDAP setup details, please contact an administrator.'], 500);
		}		

		$valid = $adldap->authenticate($this->username, $this->password);
		if ($valid)
		{
			//Retrieve details from ad. email, staff group, first name, username, surname
			$userinfo = $adldap->user()->info($this->username, ["mail", "description", "sn", "cn", "givenname"]);

			try
			{
				$user = $this->user->where('username', '=', $this->username)->first();
				if(is_object($user))
				{	
					Auth::login($user, true);
					return Response::json(Auth::user());
				}
				throw new Exception ("Failed");
			} catch (Exception $e)
			{
				return Response::json(['flash' => 'You are not in our db.'], 500);
			}
		} else {
			return Response::json(['flash' => 'Incorrect AD Details'], 500);
		}

	}
	public function getLogout()
	{
		Auth::logout();
		return Response::json(['flash' => 'Logged out!']);
	}

}