// Base Controller
import {Request, Response,RequestHandler} from "express";
import Authentication = require("../authentication");

export class BaseController {
	protected requireLogin:boolean = false;
	
	protected process(req: Request, res: Response, cb:(data:DataContract)=>void):void {
		throw "Controllers must implement process";
	}
	
	/** Use the controller for a given express request object, outputting to the given response object */
	public do(req: Request, res: Response) {
		if(this.requireLogin && !req.user) {
			res.send(JSON.stringify(<DataContract>{success:false, data:"Not Logged In"}));
		} else {
			this.process(req, res, (data)=>{res.send(JSON.stringify(data));});
		}
	}
	
	/** Convert a Firefly Controller to a Express RequestHandler */
	public static asHandler():RequestHandler {
		var controller = new this();
		return (req,res)=>controller.do(req,res);
	}
}
export interface DataContract {
	success: boolean;
	data: Object;		
}