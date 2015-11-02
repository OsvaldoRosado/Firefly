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
	public currentContent: FFGenericContent = null;
	
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
	
	public updateCurrentSlide(slide:number, cb:(success:boolean)=>void) {
		// Validate slide number
		Presentation.fromID(this.presentationId, (presentation:Presentation)=>{
			if (!presentation || slide < 0 || slide >= presentation.slideCount) {
				return cb(false);
			} else {
				this.currentSlide = slide;
				this.currentContent = null;
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
	
	public updateCurrentContent(content:FFGenericContent, cb:(success:boolean)=>void) {
		// Validate slide number
		Presentation.fromID(this.presentationId, (presentation:Presentation)=>{
			if (!presentation) {
				return cb(false);
			} else {
				this.currentContent = content;
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