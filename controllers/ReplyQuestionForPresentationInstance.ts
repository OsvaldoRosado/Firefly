import {Request, Response} from "express";
import Base = require("./BaseController");
import Presentation = require("../models/Presentation");
import PresentationInstance = require("../models/PresentationInstance");
import User = require("../models/User");
import PresentationContent = require("../models/PresentationContent");

class ReplyQuestionForPresentationInstance extends Base.BaseController {
	// Secure this endpoint
	protected requireLogin = false;

	protected process(req: Request, res: Response, cb: (data: Base.DataContract) => void) {

		var contentId = req.body.contentid;
		var contentData = JSON.parse(req.body.data);
				
		// Lookup question
		PresentationContent.fromID(contentId, (content: PresentationContent) => {

			// Add reply to question
			content.addReply(contentData, req.user, (content: PresentationContent) => {
				if (!content) {
					return cb({ success: false, data: "Could not add reply to content" });
				} else {
					return cb({ success: true, data: content });
				}
			});

		});
	}
}
export = ReplyQuestionForPresentationInstance;