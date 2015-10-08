// Firefly Processing Server Interop

// n.b. - The processing server is only accessible in the backend Firefly network.
//        To debug this code, you must VPN in to the internal network for access.

/// <reference path="typings/tsd.d.ts" />

import http = require('http');
import config = require('./config');

class FireflyProcessing {
	private static CONFIRMATION_STRING = '"ack"';
	
	public static IsReachable = function (callback:(isReachable:boolean)=>any) {
		var req = http.request({host:config.PROCESSING_SERVER}, (response) => {
			var body = '';
			response.on('data', (data) => {
				// We receive the body in chunks from a stream. Store the chunks.
				body += data;
			});
			response.on('end', () => {
				callback(body === FireflyProcessing.CONFIRMATION_STRING);
			});
		});
		
		req.on("error", ()=>callback(false));
		req.end();
	}
}

export = FireflyProcessing;