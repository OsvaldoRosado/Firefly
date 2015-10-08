import {Request, Response} from "express"
import Base = require("./BaseController")

class GetPresentationFromID extends Base.BaseController {
	private baseURL = "https://fireflypresentations.blob.core.windows.net/convert/";
	protected process(req: Request, res: Response):Base.DataContract {
		var id = req.params.id;
		if(!id) {
			return {success:false, data:"No ID"};
		}
		
		// Validate ID format
		var idComponents = (<string>id).split("-")
		if (idComponents.length != 6) {
			return {success:false, data:"Bad ID"};
		}
		
		// Prepare response
		var numSlides = parseInt(idComponents[5]);
		var coreID = idComponents.join("-").substr(0,id.length-(idComponents[5].length+1));
		var slides = [];
		for(var i=0;i<numSlides;i++){
			slides.push(this.baseURL+coreID+"/img"+i+".jpg");
		}
		
		var ret = {
			name: "Sample Presentation",
			slides: slides,
			length: numSlides
		}
		
		return {success:true, data:ret};
	}
}

export = GetPresentationFromID;