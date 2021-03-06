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
import passport = require("passport");
import bodyParser = require("body-parser");

import Config = require("./config");
import Controllers = require("./controllers/Controllers");
import Database = require("./database");
import Authentication = require("./authentication");

// Wait for database to be ready so the rest of Firefly doesn't have to
console.log("Waiting for database connection...");
Database.notifyOnReady((dbConnected)=>{
	if(!dbConnected) {
		console.log("Firefly requires a working database connection!");
		return;
	}
	
	// Initialize Express
	var app = express();
	app.use(require("express-session")({
		secret: Config.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	})); 
	
	// Configure Authentication
	Authentication.configure(Config.CAS_AUTH_URL, Config.CAS_AUTH_DOMAIN, Config.APP_ADDRESS);
	
	// Initialize file upload library, multer
	var upload:any = multer({ storage: multer.diskStorage({
		destination: "tmp/uploads/",
		filename: function (req, file, cb) {
			// Give all uploads a unique filename with their proper extension
			var extensionArray = file.originalname.split(".");
			var extension = extensionArray[extensionArray.length-1];
			cb(null, Date.now()+Math.floor(Math.random()*10000)+"."+extension);
		}
	})});	
	
	// Set our routes
	app.get("/api/login", passport.authenticate("cas"), Controllers.Login.asHandler());
	app.get("/api/logout", Controllers.Logout.asHandler());
	app.get("/api/getPresentationFromID/:id", Controllers.GetPresentationFromID.asHandler());
	app.post("/api/uploadPresentation", upload.single("presentation"), Controllers.UploadPresentation.asHandler());
	app.get("/api/getCurrentUserInfo", Controllers.GetCurrentUserInfo.asHandler());
	app.get("/api/generatePresentationInstance/:presid", Controllers.GeneratePresentationInstance.asHandler());
	app.post("/api/postCurrentState", Controllers.PostCurrentState.asHandler());
	app.get("/api/getCurrentState/:instanceid", Controllers.GetCurrentState.asHandler());
	app.get("/api/generateShortInstanceURL/:instance", Controllers.GenerateShortInstanceURL.asHandler());
	app.post("/api/postContentForPresentationInstance", Controllers.PostContentForPresentationInstance.asHandler());
	app.get("/api/getContentForPresentationInstance/:instanceid", Controllers.GetContentForPresentationInstance.asHandler());
	app.post("/api/replyQuestionForPresentationInstance", Controllers.ReplyQuestionForPresentationInstance.asHandler());
	app.get("/api/upvotePresentationContent/:contentid", Controllers.UpvotePresentationContent.asHandler());
	app.get("/api/flagPresentationContent/:contentid", Controllers.FlagPresentationContent.asHandler());

	// If no matches, use the static files directory
	// We do a special rewrite for .html
	app.use((req, res, next) => {
		var url = req.url.split("?")[0].replace("/","");
		fs.stat(Config.STATIC_DIR+url+Config.PAGE_SUFFIX, (err, stat) => {
			if(err == null) {
				// The url exists as an .html file in our public directory
				var comps = req.url.split("?");
				req.url = comps[0] + ".html" + (comps.length > 1 ? "?"+comps[1] : "");
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