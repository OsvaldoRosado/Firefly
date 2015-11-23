import BaseTest = require("../BaseTest");
import Mocks = require("../Mocks");
import User = require("../../models/User");
import GetCurrentUserInfo = require("../../controllers/GetCurrentUserInfo");

class GetCurrentUserInfoTest extends BaseTest {
	public test() {		
		// Make mocks
		var sent = "";
		var user = new User(); user.id = "testid";
		var req:any;
		var res:any = Mocks.Response({sendCB:(s)=>sent=s});
			
		// Test without user
		req = Mocks.Request({withUser:null});
		GetCurrentUserInfo.asHandler()(req, res, null);
		this.assert(!JSON.parse(sent).success,
			"Request should fail without logged in user");

		// Test with user
		req = Mocks.Request({withUser:user});
		GetCurrentUserInfo.asHandler()(req, res, null);
		this.assert(JSON.parse(sent).success && JSON.parse(sent).data.id == user.id,
			"Request should succeed with logged in user");
	}
}

export = GetCurrentUserInfoTest