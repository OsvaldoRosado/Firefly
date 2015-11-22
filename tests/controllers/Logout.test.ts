import BaseTest = require("../BaseTest");
import Logout = require("../../controllers/Logout");

class LogoutTest extends BaseTest {
	public test() {
		// Initialize Logout controller
		var login = new Logout();
		
		// Make mock objects
		var redirected = "";
		var req:any = {logout:()=>null};
		var res:any = {redirect:(s)=>redirected=s};

		// Test redirection
		login.do(req,res);
		this.assert(redirected == "/",
			"Logout should redirect to /");
	}
}

export = LogoutTest