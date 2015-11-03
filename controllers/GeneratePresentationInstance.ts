import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");
import PresentationInstance = require("../models/PresentationInstance");
import User = require("../models/User");

class GeneratePresentationInstance extends Base.BaseController {
	// Secure this endpoint
	protected requireLogin = true;
	
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		var presId = req.params.presid;
		
		// Try to lookup presentation
		Presentation.fromID(presId, (presentation:Presentation)=>{
			if (!presentation) {
				return cb({success:false, data:"Presentation not found"});
			}
			
			// Do we own this presentation?
			var user:User = req.user;
			if (user.id != presentation.submitter.id) {
				return cb({success:false, data:"User not authorized"});
			}
			
			// Generate Presentation Instance
			PresentationInstance.fromPresentation(presentation, (instance)=>{
				if (instance) {
					return cb({success:true, data:instance});
				} else {
					return cb({success:false, data:"Could not make instance"});
				}
			});
		});
	}
}
export = GeneratePresentationInstance;