import BaseTest = require("../BaseTest");
import Login = require("../../controllers/Login");
import User = require("../../models/User");
import Mocks = require("../Mocks");

class LoginTest extends BaseTest {
	public test() {
		// Initialize Login controller
		var login = new Login();
		
		// Make mock objects
		var redirected = "";
		var req:any = Mocks.Request({withQuery:{redirect:"TEST"}});
		var res:any = Mocks.Response({redirectCB:(s)=>redirected=s});
		
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