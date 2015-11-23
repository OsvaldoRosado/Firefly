import BaseTest = require("../BaseTest");
import PresentationContent = require("../../models/PresentationContent");
import User = require("../../models/User");
import Database = require("../../database");
import Presentation = require("../../models/Presentation");

class PresentationContentTest extends BaseTest {
	public test() {
		var calledCb = false;		
		// Make Mocks
		var testUser = new User(); testUser.id = "testUserId";
		var testPresentation = new Presentation(); testPresentation.id = "testPresId";
		
		// Stub Methods
		this.stub(Database, "pushModel", (obj,cb)=>{
			cb(true);
		});
		
		// Perform Tests
		PresentationContent.forPresentation(testPresentation,{testProp:"TEST",submitter:"BAD",id:"BAD"},testUser,(content:PresentationContent)=>{
			calledCb = true;
			this.assert(!!content, "Constructor should supply content");
			this.assert(!!content.id, "Content should have a valid id");
			this.assert(content.presentationId == testPresentation.id,
				"Content should be associated with supplied presentation.");
			this.assert(content.submitter.id == testUser.id,
				"Content should be associated with supplied user.");
			this.assert(content["testProp"] == "TEST",
				"Content should have supplied data appended to object");
		});
		this.assert(calledCb,
			"Constructor should call callback");
	}
}

export = PresentationContentTest