import {Request, Response} from "express";
import Base = require("./BaseController");
import Authentication = require("../authentication");

class Login extends Base.BaseController {
	protected process(req: Request, res: Response, cb:(DataContract)=>void) {
		if(req.user) {
			return res.redirect(req.params.redirect);
		} else {
			return res.redirect("/");
		}
	}
}
export = Login;