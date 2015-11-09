/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../shared/data-types.ts" />

import Base = require("./BaseModel");
import Config = require("../config");
import Presentation = require("./Presentation");

class PresentationContent extends Base.BaseModel implements FFGenericContent {
	protected static _modelIdentifier = "PresentationContent";
		
	// Follow FFPresentationInstance common public interface
	public id: string = null;
	public type: FFContentType = null;
	public submitter: FFUser = null;
	public timestamp: number = null;
	public upvotes: number = 0;
	public flagged: number = 0;
	public presentationId: string = null;
	
	public static forPresentation(pres:Presentation,data:any,user:FFUser,cb:(PresentationContent)=>void) {
		var content = new PresentationContent();
		
		// Append data - breaks PresentationContent type!
		for(var key in data){
			content[key] = data;
		}
		
		// Fill standard fields
		content.id = new Date().getTime().toString()+Math.floor(Math.random()*10000).toString();
		content.presentationId = pres.id;
		content.submitter = user;
		content.timestamp = Math.floor(new Date().getTime()/1000);
		content.upvotes = 0;
		content.flagged = 0;
		
		// Store in db
		content.save((success)=>{
			if (success) {
				return cb(content);
			} else {
				return cb(null);
			}
		});
	}
}

export = PresentationContent;