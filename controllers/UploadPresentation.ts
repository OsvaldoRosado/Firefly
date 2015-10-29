import {Request, Response} from "express"
import Base = require("./BaseController")

class UploadPresentation extends Base.BaseController {
	protected process(req: Request, res: Response):Base.DataContract {
		
		return {success:true, data:null};
	}
}

export = UploadPresentation;