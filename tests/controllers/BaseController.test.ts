import BaseTest = require("../BaseTest");
import BaseController = require("../../controllers/BaseController");

var testObject = {abc:"DEF",ghi:["j","k","l"]};

class TestController extends BaseController.BaseController {
	protected process(req: any, res: any, cb:(data:BaseController.DataContract)=>void):void {
		cb({success:true,data:testObject});
	}
}

class BaseControllerTest extends BaseTest {
	public test() {		
		// Make mock objects
		var sent = "";
		var req:any = {};
		var res:any = {send:(s)=>sent=s};
		
		// Test raw controller
		var failed = true;
		try {
			BaseController.BaseController.asHandler()(req,res,null);
		} catch (e) {
			failed = false;
		}
		this.assert(!failed, "Raw BaseController cannot be used.");
		
		
		// Test TestController
		TestController.asHandler()(req,res,null);
		var data = JSON.parse(sent);
		this.assert(data.success, 
			"Controller should serialize success value");
		this.assert(JSON.stringify(testObject) == JSON.stringify(data.data),
			"Controller should serialize data object");
	}
}

export = BaseControllerTest