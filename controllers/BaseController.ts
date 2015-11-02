// Base Controller
import {Request, Response,RequestHandler} from "express";

export class BaseController {
	protected process(req: Request, res: Response, cb:(DataContract)=>void):void {
		throw "Controllers must implement process";
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