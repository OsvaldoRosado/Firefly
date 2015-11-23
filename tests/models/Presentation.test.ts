import BaseTest = require("../BaseTest");
import Presentation = require("../../models/Presentation");
import User = require("../../models/User");
import Config = require("../../config");
import Database = require("../../database")
import FormData = require('form-data');
import fs = require('fs');

class PresentationTest extends BaseTest {
	public test() {		
		// Make Mocks
		var fileUploaded = false;
		var callbackRan = false;
		var testFileData = "TESTFILEDATA";
		var testUser = new User(); testUser.id = "testId";
		var testFile:any = {
			destination: "testDir/",
			filename: "testfile.ext"
		}
		var conversionPayload = JSON.stringify({
			success: true,
			msg: "59227f68-0818-4493-91df-c4b065a5011b-2"
		});
		
		// Stub Functions
		this.stub(fs,"createReadStream",(path)=>{
			if (path == testFile.destination+testFile.filename) {
				return testFileData;
			} else {
				return null;
			}
		});
		
		this.stub(fs,"unlinkSync",()=>{
			return;
		});
		
		this.stub(Database, "pushModel", (obj,cb)=>{
			cb(true);
		});
		
		// Stub formdata to verify usage
		this.stub(FormData.prototype,"append",(name,data)=>{
			this.assert(data == testFileData, 
				"File data must be added to form");
			this.assert(name == "presentation", 
				"File data must be added to key 'presentation'");
			fileUploaded = true;
		});
		
		// Stub formdata to emulate processing server
		this.stub(FormData.prototype,"submit",(url,cb)=>{
			if (url != Config.PROCESSING_SERVER + "/convert" || fileUploaded == false) {
				cb("error",null);
			} else {
				var res = {
					on: (name, func)=>{
						if (name == "data") {
							func(conversionPayload);
						} else if (name == "end") {
							func();
						}
					},
					resume: ()=>null
				}
				cb(null,res);
			}
		});
		
		
		// Perform test
		Presentation.fromFile("Test Presentation", testUser, testFile, (pres:Presentation)=>{
			callbackRan = true;
			this.assert(!!pres,
				"Presentation should be supplied to callback");
			this.assert(pres.id == JSON.parse(conversionPayload).msg,
				"Presentation should keep id from conversion server");
			this.assert(pres.slideCount == 2,
				"Presentation should keep slide count from id");
			this.assert(pres.slideUrls.length == pres.slideCount,
				"Presentation slide count and URL array length should be consistent");
			this.assert(pres.submitter.id == testUser.id,
				"Presentation should retain supplied user as submitter");
			this.assert(fileUploaded,
				"Presentation constructor should call conversion server for data");
		});
		this.assert(callbackRan,
			"Presentation constructor should execute supplied callback");
	}
}

export = PresentationTest