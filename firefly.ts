/*
================================================

███████╗██╗██████╗ ███████╗███████╗██╗  ██╗   ██╗    
██╔════╝██║██╔══██╗██╔════╝██╔════╝██║  ╚██╗ ██╔╝    
█████╗  ██║██████╔╝█████╗  █████╗  ██║   ╚████╔╝     
██╔══╝  ██║██╔══██╗██╔══╝  ██╔══╝  ██║    ╚██╔╝      
██║     ██║██║  ██║███████╗██║     ███████╗██║       
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝       

============= Firefly - 2015 ===================
*/

/// <reference path="typings/tsd.d.ts" />
import express = require('express');

// Configuration Constants
var FF_DEFAULT_PORT = 8080;

// Initialize Express
var app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Run it!
var server = app.listen(process.env.PORT || FF_DEFAULT_PORT, () => {
	console.log('Firefly - Running on port %s', server.address().port);
});