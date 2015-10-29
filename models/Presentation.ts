/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../shared/data-types.ts" />

import Base = require("./BaseModel");
import Config = require("../config");
import FormData = require('form-data');
import http = require('http');
import fs = require('fs');

class Presentation extends Base.BaseModel implements FFPresentation {
	// Follow FFPresentation common public interface
	public id: string;
	public name: string = "Unknown Presentation";
	public submitter: FFUser;
	public timestamp: number = Math.floor(new Date().getTime()/1000);
	public slideCount: number = 0;
	public slideUrls: string[] = [];
	
	// Internal variables
	private static _presentationBase = Config.FILE_SERVER + "/convert/";
	private static _conversionURL = Config.PROCESSING_SERVER + "/convert";
	
	public static fromFile(file:Express.Multer.File, cb:(Presentation)=>void):void {	
		// Prepare the POST payload
		var form = new FormData();
		var path = file.destination+file.filename;
		form.append('presentation', fs.createReadStream(path));
		
		// Send the payload
		form.submit(Presentation._conversionURL, (err, res) => {
			if (err) {
				console.log(err);
				cb(null);
			} else {
				var body = "";
				res.on('data', function (data) {
					body += data;
				});
				res.on('end', function () {
					// Delete the uploaded file. We don't need it.
					// also end our server connection
					fs.unlinkSync(path);
					res.resume();
					
					// Parse the response
					var data = JSON.parse(body);				
					if (data.success) {
						// Generate a Presentation instance
						var pres = new Presentation(data.msg);
						return cb(pres);
					} else {
						return cb(null);
					}
				});
			}
		});
	}
	
	// Construct a presentation from an ID
	public constructor(id:string) {
		super();
		
		// Does id exist?
		if (!id) {
			return null;
		}
		
		// Is id in valid format?
		var idComponents = (<string>id).split("-")
		if (idComponents.length != 6) {
			return null;
		}
		
		// Fill variables
		this.id = id;
		this.slideCount = parseInt(idComponents[5]);
		var internalID = idComponents.join("-").substr(0,id.length-(idComponents[5].length+1));
		for(var i=0; i<this.slideCount; i++){
			this.slideUrls.push(Presentation._presentationBase + internalID + "/img" + i + ".jpg");
		}
	}
}

export = Presentation;