// Base Controller
import {Request, Response} from "express"

class BaseController {
	protected process : (req: Request, res: Response)=>DataContract;
	
	public do(req: Request, res: Response) {
		res.send(JSON.stringify(this.process(req,res)));
	}
}
interface DataContract {
	success: boolean;
	data: Object;		
}
	
export = BaseController;