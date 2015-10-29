/*
================================================

███████╗██╗██████╗ ███████╗███████╗██╗  ██╗   ██╗    
██╔════╝██║██╔══██╗██╔════╝██╔════╝██║  ╚██╗ ██╔╝    
█████╗  ██║██████╔╝█████╗  █████╗  ██║   ╚████╔╝     
██╔══╝  ██║██╔══██╗██╔══╝  ██╔══╝  ██║    ╚██╔╝      
██║     ██║██║  ██║███████╗██║     ███████╗██║       
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝       

================ Firefly - 2015 ================
*/

/// <reference path="typings/tsd.d.ts" />
import express = require("express");
import fs = require("fs");
import multer = require("multer");

import config = require("./config");
import controllers = require("./controllers/Controllers");

// Initialize Express and file upload library
var app = express();
var upload:any = multer({ storage: multer.diskStorage({
	destination: 'tmp/uploads/',
	filename: function (req, file, cb) {
		// Give all uploads a unique filename with their proper extension
		var extensionArray = file.originalname.split(".");
		var extension = extensionArray[extensionArray.length-1];
		cb(null, Date.now()+Math.floor(Math.random()*10000)+"."+extension);
	}
})});



// Set our routes
app.get('/api/getPresentationFromID/:id', controllers.GetPresentationFromID.asHandler());
app.post('/api/uploadPresentation', upload.single('presentation'), controllers.UploadPresentation.asHandler());

// If no matches, use the static files directory
// We do a special rewrite for .html
app.use((req, res, next) => {
	fs.stat(config.STATIC_DIR+req.url+config.PAGE_SUFFIX, (err, stat) => {
		if(err == null) {
			// The url exists as an .html file in our public directory
			req.url += config.PAGE_SUFFIX;
		}
		next();
	});
});
app.use(express.static(config.STATIC_DIR));

// Run it!
var server = app.listen(process.env.PORT || config.DEFAULT_PORT, () => {
	console.log("%s - Running on port %s", config.DISPLAY_NAME, server.address().port);
});
