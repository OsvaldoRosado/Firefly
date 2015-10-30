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

import Config = require("./config");
import Controllers = require("./controllers/Controllers");
import Database = require("./database");


// Wait for database to be ready so the rest of Firefly doesn't have to
console.log("Waiting for database connection...");
Database.notifyOnReady((dbConnected)=>{
	if(!dbConnected) {
		console.log("Firefly requires a working database connection!");
		return;
	}
	
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
	app.get('/api/getPresentationFromID/:id', Controllers.GetPresentationFromID.asHandler());
	app.post('/api/uploadPresentation', upload.single('presentation'), Controllers.UploadPresentation.asHandler());
	
	// If no matches, use the static files directory
	// We do a special rewrite for .html
	app.use((req, res, next) => {
		fs.stat(Config.STATIC_DIR+req.url+Config.PAGE_SUFFIX, (err, stat) => {
			if(err == null) {
				// The url exists as an .html file in our public directory
				req.url += Config.PAGE_SUFFIX;
			}
			next();
		});
	});
	app.use(express.static(Config.STATIC_DIR));
	
	// Run it!
	var server = app.listen(process.env.PORT || Config.DEFAULT_PORT, () => {
		console.log("%s - Running on port %s", Config.DISPLAY_NAME, server.address().port);
	});
});