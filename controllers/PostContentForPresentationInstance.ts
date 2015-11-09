import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");
import PresentationInstance = require("../models/PresentationInstance");
import User = require("../models/User");
import PresentationContent = require("../models/PresentationContent");

class PostContentForPresentationInstance extends Base.BaseController {
	// Secure this endpoint
	protected requireLogin = false;
	
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		
		var instanceId = req.body.instanceid;
		var contentData = JSON.parse(req.body.data);
		
		// Try to lookup presentation instance
		PresentationInstance.fromID(instanceId, (instance:PresentationInstance)=>{
			if (!instance) {
				return cb({success:false, data:"Presentation instance not found"});
			}
			
			// Lookup presentation
			Presentation.fromID(instance.presentationId, (pres:Presentation)=>{
				if (!pres) {
					return cb({success:false, data:"Presentation not found"});
				}
				
				// Generate content
				PresentationContent.forPresentation(pres, contentData, req.user,(content:PresentationContent)=>{
					if (!content) {
						return cb({success:false, data:"Could not generate content"});
					} else {
						return cb({success:true, data:content});
					}
				});
			});
			
		});
	}
}
export = PostContentForPresentationInstance;