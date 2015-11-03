import {Request, Response} from "express";
import Base = require("./BaseController");
import Authentication = require("../authentication");

class GetCurrentUserInfo extends Base.BaseController {
	// Secure this endpoint
	protected requireLogin = true;
	
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		return cb({success:true,data:req.user});
	}
}
export = GetCurrentUserInfo;