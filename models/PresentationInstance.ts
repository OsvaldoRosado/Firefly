/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../shared/data-types.ts" />

import Base = require("./BaseModel");
import Config = require("../config");
import Presentation = require("./Presentation");

class PresentationInstance extends Base.BaseModel implements FFPresentationInstance {
	protected static _modelIdentifier = "PresentationInstance";
		
	// Follow FFPresentationInstance common public interface
	public id: string = null;
	public presentationId: string = null;
	public currentSlide: number = 0;
	public currentContentId: string = null;
	
	/** Create an "instance" of a presentation.
	 * 	Generates a unique id indicating a specific "viewing" of a presentation and stores it in the database.
	 */
	public static fromPresentation(pres:Presentation,cb:(PresentationInstance)=>void) {
		var instance = new PresentationInstance();
		
		// Generate a new unique ID
		instance.id = new Date().getTime().toString()+Math.floor(Math.random()*10000).toString();
		
		// Fill fields
		instance.presentationId = pres.id;
		
		// Store in db
		instance.save((success)=>{
			if (success) {
				return cb(instance);
			} else {
				return cb(null);
			}
		});
	}
	
	/** Updates the current slide number and content id(if any) for the current presentation instance.
	 *  This is used to keep all clients in sync with the presenter's presentation state.
	 */
	public updateCurrentSlideAndContent(slide:number, contentId:string, cb:(success:boolean)=>void) {
		// Validate slide number
		Presentation.fromID(this.presentationId, (presentation:Presentation)=>{
			if (!presentation || slide < 0 || slide >= presentation.slideCount) {
				return cb(false);
			} else {
				this.currentSlide = slide;
				this.currentContentId = contentId;
				this.save((success)=>{
					if (success) {
						return cb(true);
					} else {
						return cb(false);
					}
				});
			}
		});
	}
}

export = PresentationInstance;