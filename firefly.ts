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
import express = require('express');
import config = require('./config');

// Initialize Express and set our routes
var app = express();

import indexController = require('./controllers/index');
app.get('/', indexController);

// Run it!
var server = app.listen(process.env.PORT || config.DEFAULT_PORT, () => {
	console.log('%s - Running on port %s', config.DISPLAY_NAME, server.address().port);
});
