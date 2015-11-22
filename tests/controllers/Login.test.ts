import BaseTest = require("../BaseTest");
import Login = require("../../controllers/Login");
import User = require("../../models/User")

class LoginTest extends BaseTest {
	public test() {
		// Initialize Login controller
		var login = new Login();
		
		// Make mock objects
		var redirected = "";
		var req:any = {query:{redirect:"TEST"}};
		var res:any = {redirect:(s)=>redirected=s};
		
		// Test without credentials
		login.do(req,res);
		this.assert(redirected == "/",
			"On failure, login should redirect to /");
		
		// Test with credentials
		req.user = new User();
		login.do(req,res);
		this.assert(redirected == "TEST",
			"On success, login should redirect to query variable");
	}
}

export = LoginTest