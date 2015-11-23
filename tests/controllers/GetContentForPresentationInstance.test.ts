import BaseTest = require("../BaseTest");
import Mocks = require("../Mocks");
import GetContentForPresentationInstance = require("../../controllers/GetContentForPresentationInstance");
import User = require("../../models/User");
import Presentation = require("../../models/Presentation");
import PresentationInstance = require("../../models/PresentationInstance");
import PresentationContent = require("../../models/PresentationContent");

class GetContentForPresentationInstanceTest extends BaseTest {
	public test() {		
		// Make mocks
		var sent = "";
		var validPres = new Presentation(); validPres.id = "validpresid";
		var validInstance = new PresentationInstance(); validInstance.id = "valid"; validInstance.presentationId = validPres.id;
		var invalidInstance = new PresentationInstance(); invalidInstance.id = "invalid"; invalidInstance.presentationId = null;
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
		
		this.stub(PresentationInstance,"fromID",(id:string,cb:(PresentationInstance)=>void)=>{
			if(id == validInstance.id) {
				cb(validInstance);
			} else if (id == invalidInstance.id) {
				cb(invalidInstance);
			} else {
				cb(null);
			}
		});
		
		this.stub(PresentationContent,"fromMatchObject",(match:any,cb:(PresentationContent)=>void)=>{
			if(match.presentationId == validPres.id) {
				cb(new PresentationContent());
			} else {
				cb(null);
			}
		});
			
		// Test with invalid instance id
		req = Mocks.Request({withParams:{instanceid:"baddata"}});
		GetContentForPresentationInstance.asHandler()(req, res, null);
		this.assert(!JSON.parse(sent).success,
			"Request should fail without valid instance id");
			
		// Test with instance id that gives invalid presentation
		req = Mocks.Request({withParams:{instanceid:invalidInstance.id}});
		GetContentForPresentationInstance.asHandler()(req, res, null);
		this.assert(!JSON.parse(sent).success,
			"Request should fail without valid presentation");
			
		// Test with valid instance id that has content
		req = Mocks.Request({withParams:{instanceid:validInstance.id}});
		GetContentForPresentationInstance.asHandler()(req, res, null);
		this.assert(JSON.parse(sent).success && JSON.parse(sent).data != null,
			"Request should succeed with valid instance id and content");
	}
}

export = GetContentForPresentationInstanceTest