import {Request, Response} from "express";
import Base = require("./BaseController");
import Config = require("../Config");
import http = require('http');

class GenerateShortInstanceURL extends Base.BaseController {
	protected process(req: Request, res: Response, cb:(data:Base.DataContract)=>void) {
		var instance = req.params.instance;
		var shortenerServiceHost = "is.gd";
		var shortenerServiceEndpoint = "/create.php?format=simple&url=";
		var shortenBase = Config.MAIN_DOMAIN+"/viewer2?id=";
		
		// Make request to shortenerService
		var request = http.request({host:shortenerServiceHost,path:shortenerServiceEndpoint+encodeURIComponent(shortenBase+instance)}, (response) => {
			var body = '';
			response.on('data', (data) => {
				// We receive the body in chunks from a stream. Store the chunks.
				body += data;
			});
			response.on('end', () => {
				cb({success:true,data:body});
			});
		});
		request.on("error", ()=>cb({success:false,data:null}));
		request.end();
	}
}
export = GenerateShortInstanceURL;