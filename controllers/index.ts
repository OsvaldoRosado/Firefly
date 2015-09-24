// Firefly Index Controller
import {RequestHandler} from 'express';
import processing = require('../processing');

var controller:RequestHandler = function (req, res) {
	var body = "<h1>Firefly!</h1>";
	
	// Test backend server communication
	processing.IsReachable((isReachable)=>{
		if(isReachable) {
			body += "<h2>Backend processing server reachable.</h2>";
		} else {
			body += "<h2 style='color:red'>Could not reach backend processing server!</h2>";
		}
		
		res.send(body);
	});
}

export = controller;