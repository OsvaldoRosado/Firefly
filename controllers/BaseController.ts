// Base Controller
import {Request, Response,RequestHandler} from "express";
import Authentication = require("../authentication");

export class BaseController {
	protected process(req: Request, res: Response, cb:(DataContract)=>void):void {
		throw "Controllers must implement process";
	}
	
	private requireLogin(req: Request, cb:(DataContract)=>void):void {
		if(!req.user){
			cb({success:false, data:"Not Logged In"});
		}
	}
	
	public do(req: Request, res: Response) {
		this.process(req, res, (data)=>{
			res.send(JSON.stringify(data));
		});
	}
	
	public static asHandler():RequestHandler {
		var controller = new this();
		return (req,res)=>controller.do(req,res);
	}
}
export interface DataContract {
	success: boolean;
	data: Object;		
}