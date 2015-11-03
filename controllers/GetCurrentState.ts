import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");
import PresentationInstance = require("../models/PresentationInstance");
import User = require("../models/User");

class GetCurrentState extends Base.BaseController {	
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		var instanceId = req.params.instanceid;
		
		// Try to lookup presentation instance
		PresentationInstance.fromID(instanceId, (instance:PresentationInstance)=>{
			if (!instance) {
				return cb({success:false, data:"Presentation instance not found"});
			}
			
			return cb({success:true, data:instance});
		});
	}
}
export = GetCurrentState;