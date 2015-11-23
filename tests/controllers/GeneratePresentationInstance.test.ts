import BaseTest = require("../BaseTest");
import Mocks = require("../Mocks");
import GeneratePresentationInstance = require("../../controllers/GeneratePresentationInstance");
import User = require("../../models/User");
import Presentation = require("../../models/Presentation");
import PresentationInstance = require("../../models/PresentationInstance");

class GeneratePresentationInstanceTest extends BaseTest {
	public test() {		
		// Make mocks
		var sent = "";
		var validUser = new User(); validUser.id = "validUser";
		var invalidUser = new User(); invalidUser.id = "invalidUser";
		var validPres = new Presentation(); validPres.id = "validpresid"; validPres.submitter = validUser;
		var req:any;
		var res:any = Mocks.Response({sendCB:(s)=>sent=s});
		
		// Stub Functions
		this.stub(Presentation,"fromID",(presid:string,cb:(Presentation)=>void)=>{
			if(presid == validPres.id) {
				cb(validPres);
			}else{
				cb(null);
			}
		});
		
		this.stub(PresentationInstance,"fromPresentation",(pres:Presentation,cb:(PresentationInstance)=>void)=>{
			if(pres.id == validPres.id) {
				cb(new PresentationInstance());
			} else {
				cb(null);
			}
		});
		
		// Test without user
		req = Mocks.Request({withUser:null,withParams:{presid:"presid"}});
		GeneratePresentationInstance.asHandler()(req, res, null);
		this.assert(!JSON.parse(sent).success,
			"Request should fail without authentication");
			
		// Test with invalid user & invalid presentation
		req = Mocks.Request({withUser:invalidUser,withParams:{presid:"presid"}});
		GeneratePresentationInstance.asHandler()(req, res, null);
		this.assert(!JSON.parse(sent).success,
			"Request should fail without valid user or presentation");
			
		// Test with valid user & invalid presentation
		req = Mocks.Request({withUser:validUser,withParams:{presid:"presid"}});
		GeneratePresentationInstance.asHandler()(req, res, null);
		this.assert(!JSON.parse(sent).success,
			"Request should fail without valid presentation");
			
		// Test with valid user & presentation
		req = Mocks.Request({withUser:validUser,withParams:{presid:"validpresid"}});
		GeneratePresentationInstance.asHandler()(req, res, null);
		this.assert(JSON.parse(sent).success && JSON.parse(sent).data != null,
			"Request should succeed with valid user and presentation");
	}
}

export = GeneratePresentationInstanceTest