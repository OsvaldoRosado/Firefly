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
		var req:any = Mocks.Request({withUser:false});
		var res:any = Mocks.Response({sendCB:(s)=>sent=s});
		
		// Stub Functions
		this.stub(Presentation,"fromID",()=>{
			console.log("Stubbed!");
		});
		
		// Test without owning
		GeneratePresentationInstance.asHandler()(req, res, null);
		console.log(sent);
	}
}

export = GeneratePresentationInstanceTest