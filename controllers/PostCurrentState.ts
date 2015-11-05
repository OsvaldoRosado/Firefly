import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");
import PresentationInstance = require("../models/PresentationInstance");
import User = require("../models/User");

class PostCurrentState extends Base.BaseController {
	// Secure this endpoint
	protected requireLogin = true;
	
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		var instanceId = req.body.instanceid;
		var currentSlide = req.body.curslide;
		var currentContentId = req.body.curcontentid;
		
		// Try to lookup presentation instance
		PresentationInstance.fromID(instanceId, (instance:PresentationInstance)=>{
			if (!instance) {
				return cb({success:false, data:"Presentation instance not found"});
			}
			
			// Look up the presentation to verify ownership
			Presentation.fromID(instance.presentationId, (presentation:Presentation)=>{
				if (!presentation) {
					return cb({success:false, data:"Presentation not found"});
				}
				
				// Do we own this presentation?
				var user:User = req.user;
				if (user.id != presentation.submitter.id) {
					return cb({success:false, data:"User not authorized"});
				}
				
				// Update the instance
				currentSlide = parseInt(currentSlide);
				instance.updateCurrentSlideAndContent(currentSlide,currentContentId, (success)=>{
					return cb({success:success, data:null});
				});
			});
		});
	}
}
export = PostCurrentState;