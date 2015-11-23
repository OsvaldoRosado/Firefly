import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");
import PresentationInstance = require("../models/PresentationInstance");
import User = require("../models/User");
import PresentationContent = require("../models/PresentationContent");

class FlagPresentationContent extends Base.BaseController {
	// Secure this endpoint
	protected requireLogin = true;

	protected process(req: Request, res: Response, cb: (data: Base.DataContract) => void) {

		var contentId = req.params.contentid;
				
		// Lookup content
		PresentationContent.fromID(contentId, (content: PresentationContent) => {

			// flag content
			content.flag((content: PresentationContent) => {
				if (!content) {
					return cb({ success: false, data: "Could not flag content" });
				} else {
					return cb({ success: true, data: content });
				}
			});

		});
	}
}
export = FlagPresentationContent;