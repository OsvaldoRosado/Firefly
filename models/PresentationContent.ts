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
	public replies: Array<FFTextContent> = null;
	
	/** Store arbitrary content deriving from FFGenericContent in the database for a given presentation.
	 * 	Any key/value pairs provided in the data object will be applied directly as properties on the data model.
	 */
	public static forPresentation(pres:Presentation,data:any,user:FFUser,cb:(PresentationContent)=>void) {
		var content = new PresentationContent();
		
		// Append data - breaks PresentationContent type!
		for(var key in data){
			content[key] = data[key];
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

	/** Add a reply the the `replies` key. Only questions have this key. */
	public addReply(reply: FFTextContent, user:FFUser, cb:(PresentationContent)=>void) {

		if (user) { reply.submitter = user; }

		if(!this.replies) {
			this.replies = [reply];
		}
		else {
			this.replies.push(reply);
		}

		// Edit db entry
		this.save((success)=>{
			if (success) {
				return cb(this);
			} else {
				return cb(null);
			}
		});
	}

	/** Increment the vote count by 1 */
	public upvote(cb: (PresentationContent)=>void){
		this.upvotes++;

		this.save((success)=>{
			if (success) {
				return cb(this);
			} else {
				return cb(null);
			}
		});
	}

	/** Set the flag on this content, used to report it as inappropriate to
	  * the presenter. No method is provided to undo this action.
	  */
	public flag(cb: (PresentationContent)=>void){
		this.flagged = 1;

		this.save((success)=>{
			if (success) {
				return cb(this);
			} else {
				return cb(null);
			}
		});
	}
}

export = PresentationContent;