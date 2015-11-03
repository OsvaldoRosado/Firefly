// Firefly Authentication Configurator
/// <reference path="typings/tsd.d.ts" />

import User = require("./models/User");
import passport = require("passport");
var CASStrategy = require("passport-cas").Strategy;

class Authentication {
	static configure(authUrl:string,authDomain:string,baseUrl:string){
		// Configure passport to use CAS authentication and make FFUsers
		passport.use(new CASStrategy({
			version: 'CAS3.0',
			ssoBaseURL: authUrl,
			serverBaseURL: baseUrl
		}, (profile, done)=>{
			var username = (<string>profile.user).toLowerCase();
			User.fromThirdParty(username,authDomain, (user)=>{
				done(null, user);
			});
		}));
		passport.serializeUser((user:User, done)=>{
			done(null, user.id);
		});
		
		passport.deserializeUser((id, done)=>{
			User.fromID(id, function(user) {
				if(!user){
					done(true,null);
				}else{
					done(null,user);
				}
			});
		});
	}
}

export = Authentication;