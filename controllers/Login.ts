import {Request, Response} from "express";
import Base = require("./BaseController");
import Authentication = require("../authentication");

class Login extends Base.BaseController {
	protected process(req: Request, res: Response, cb:(DataContract)=>void) {
		if(req.user) {
			return cb({success:true, data:null});
		} else {
			return cb({success:false, data:"Not Logged In"});
		}
	}
}
export = Login;