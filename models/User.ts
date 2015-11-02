/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../shared/data-types.ts" />

import Base = require("./BaseModel");
import Config = require("../config");

class User extends Base.BaseModel implements FFUser {
	protected static _modelIdentifier = "User";
		
	// Follow FFUser common public interface
	public id: string = "Unknown";
	public name: string = "Unknown";
	
	public static fromThirdParty(username: string, serviceDomain: string, cb: (User)=>void):void {	
		// Third parties ensure unique identifiers. No validation needed.
		// Identifiers stay the same too, so no lookups needed.
		// We save this in the DB for metrics purposes
		
		if(name == "" || serviceDomain == "") {
			return cb(null);
		}
		
		var user = new User();
		user.id = username+"@"+serviceDomain;
		user.name = username;
		
		// Store user record in the database
		// n.b. save will update previously existing record, so this avoids duplicates!
		user.save((success)=>{
			if (success) {
				cb(user);
			} else {
				cb(null);
			}
		});
	}
}

export = User;