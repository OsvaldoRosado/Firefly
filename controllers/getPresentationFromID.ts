import {Request, Response} from "express"
import Base = require("./BaseController")
import Presentation = require("../models/Presentation")

class GetPresentationFromID extends Base.BaseController {
	protected process(req: Request, res: Response):Base.DataContract {
		var id = req.params.id;
		
		var presentation = new Presentation(id);
		if (presentation) {
			return {success:true, data:presentation};
		} else {
			return {success:false, data:"Invalid Presentation"};
		}
		
	}
}
export = GetPresentationFromID;