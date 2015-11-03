import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");

class GetPresentationFromID extends Base.BaseController {
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		var id = req.params.id;
		
		Presentation.fromID(id,(presentation)=>{
			if (presentation) {
				return cb({success:true, data:presentation});
			} else {
				return cb({success:false, data:"Invalid Presentation"});
			}
		});		
	}
}
export = GetPresentationFromID;