/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../shared/data-types.ts" />

import Base = require("./BaseModel");
import Config = require("../config");
import FormData = require('form-data');
import http = require('http');
import fs = require('fs');
import User = require("./User");

class Presentation extends Base.BaseModel implements FFPresentation {
	protected static _modelIdentifier = "Presentation";
		
	// Follow FFPresentation common public interface
	public id: string = "Unknown";
	public name: string = "Unknown";
	public submitter: FFUser;
	public timestamp: number = 0;
	public slideCount: number = 0;
	public slideUrls: string[] = [];
	
	// Internal variables
	private static _presentationBase = Config.FILE_SERVER + "/convert/";
	private static _conversionURL = Config.PROCESSING_SERVER + "/convert";
	
	public static fromFile(name: string, user:User, file:Express.Multer.File, cb:(Presentation)=>void):void {	
		// Prepare the POST payload
		var form = new FormData();
		var path = file.destination+file.filename;
		form.append("presentation", fs.createReadStream(path));
		
		// Send the payload
		form.submit(Presentation._conversionURL, (err, res) => {
			if (err) {
				cb(null);
			} else {
				var data = "";
				res.on("data", (chunk) => {data += chunk;});
				res.on("end", () => {
					// Delete the uploaded file. We don't need it.
					// also end our server connection
					fs.unlinkSync(path);
					res.resume();
					
					this.fromConversionPayload(name, user, data, cb);
				});
			}
		});
	}
	
	private static fromConversionPayload(name: string, user:User, body:string, cb:(Presentation)=>void):void{
		// Parse the response
		var payload = JSON.parse(body);				
		if (!payload.success) {
			return cb(null);	
		}
		
		// Construct a Presentation instance
		var pres = new Presentation();
		pres.name = name;
		pres.submitter = user;
		pres.timestamp = Math.floor(new Date().getTime()/1000);
		
		// Parse payload ID
		// ID should be in form GUID-NUMSLIDES
		pres.id = payload.msg;
		var idComponents = (<string>pres.id).split("-") 
		if (idComponents.length != 6) { 
			return cb(null); 
		}
		pres.slideCount = parseInt(idComponents[5]);
		var internalID = idComponents.join("-").substr(0,pres.id.length-(idComponents[5].length+1)); 
		for(var i=0; i<pres.slideCount; i++){ 
			pres.slideUrls.push(Presentation._presentationBase + internalID + "/img" + i + ".jpg"); 
		}
		
		// Sanity check
		if (pres.slideCount <= 0) {
			return cb(null);
		}
		
		// Save the instance to the database
		pres.save((success)=>{
			if (success) {
				cb(pres);
			} else {
				cb(null);
			}
		});
	}
}

export = Presentation;