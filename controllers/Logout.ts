import {Request, Response} from "express";
import Base = require("./BaseController");
import Authentication = require("../authentication");

class Logout extends Base.BaseController {
	protected process(req: Request, res: Response, cb:(DataContract)=>void) {
		req.logout();
		return res.redirect("/");
	}
}
export = Logout;