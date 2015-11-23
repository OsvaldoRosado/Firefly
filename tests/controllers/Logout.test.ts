import BaseTest = require("../BaseTest");
import Logout = require("../../controllers/Logout");
import Mocks = require("../Mocks");

class LogoutTest extends BaseTest {
	public test() {
		// Initialize Logout controller
		var login = new Logout();
		
		// Make mock objects
		var redirected = "";
		var req:any = Mocks.Request({logoutCB:()=>null});
		var res:any = Mocks.Response({redirectCB:(s)=>redirected=s});

		// Test redirection
		login.do(req,res);
		this.assert(redirected == "/",
			"Logout should redirect to /");
	}
}

export = LogoutTest