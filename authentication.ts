// Firefly Authentication Configurator
/// <reference path="typings/tsd.d.ts" />

import {Request, Response, RequestHandler} from "express";
import User = require("./models/User");
import passport = require("passport");
var CasStrategy = require("passport-cas2").Strategy;

class Authentication {
	static configure(authUrl:string,authDomain:string){
		// Configure passport to use CAS authentication and make FFUsers
		passport.use(new CasStrategy(
			{casURL: authUrl}, 
			function(username, profile, done) {
				console.log(profile);
				User.fromThirdParty(username,authDomain, (user)=>{
					done(null, user);
				});
			}
		));
	}
}

export = Authentication;