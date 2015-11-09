import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");
import PresentationInstance = require("../models/PresentationInstance");
import User = require("../models/User");
import PresentationContent = require("../models/PresentationContent");

class GetContentForPresentationInstance extends Base.BaseController {
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		var instanceId = req.params.instanceid;
		
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
				
				// Look for content
				PresentationContent.fromMatchObject({presentationId:pres.id}, (content)=>{
					if (!content) {
						return cb({success:false, data:"Could not lookup content"});
					}
					return cb({success:true, data:content});
				})
			});
			
		});
	}
}
export = GetContentForPresentationInstance;