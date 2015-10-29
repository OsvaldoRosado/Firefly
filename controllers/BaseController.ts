// Base Controller
import {Request, Response,RequestHandler} from "express"

export class BaseController {
	protected process(req: Request, res: Response):DataContract {
		throw "Controllers must implement process";
	}
	
	public do(req: Request, res: Response) {
		res.send(JSON.stringify(this.process(req,res)));
	}
	
	public static AsHandler():RequestHandler {
		var controller = new this();
		return (req,res)=>controller.do(req,res);
	}
}
export interface DataContract {
	success: boolean;
	data: Object;		
}