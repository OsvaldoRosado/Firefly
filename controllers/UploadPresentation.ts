import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");

class UploadPresentation extends Base.BaseController {	
	protected process(req: Request, res: Response, cb:(DataContract)=>void) {
		var file:Express.Multer.File = (<any>req).file;
		
		if(!file) {
			return cb({success:false, data:"No file for upload"}); 
		}
		
		Presentation.fromFile(file, (presentation)=>{
			if(presentation) {
				return cb({success:true, data:presentation});
			} else {
				return cb({success:false, data:"Upload failed"});
			}
		});		
	}
}

export = UploadPresentation;