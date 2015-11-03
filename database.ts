// Firefly MongoDB Wrapper
/// <reference path="typings/tsd.d.ts" />

import MongoDB = require('mongodb');
import Config = require('./config');
import fs = require('fs');
import BaseModel = require('./models/BaseModel');

class Database {
	private connectionString: string = "";
	private isReady:boolean = false;
	private database:MongoDB.Db = null;
	private readyWaiters: ((boolean)=>void)[] = [];
	
	constructor(){
		// Get the connection string
		// If we're on the server, its an environment variable
		if (process.env[Config.CONNECTION_STRING_ENV]){ 
			this.connectionString = process.env[Config.CONNECTION_STRING_ENV];
		} else {
			// We're going to need this in a local file then
			this.connectionString = fs.readFileSync(Config.CONNECTION_STRING_FILE, "utf8");
		}
		
		console.log(this.connectionString);
		
		// Verify connection string exists
		if (this.connectionString == "") {
			console.log("DATABASE ERROR!: No connection string file or environment variable!");
			return null;
		}
		
		// Connect to DB lazily
		MongoDB.MongoClient.connect(this.connectionString, (err, db)=> {
			this.isReady = true;
			if (err) {
				console.log("DATABASE ERROR!: Could not connect to database!");
			} else {
				this.database = db;
			}
			
			// Notify waiters
			this.readyWaiters.forEach((waiter)=>{
				waiter(!err);
			});
			this.readyWaiters = [];
		});
	}
	
	public notifyOnReady(cb:(ok:boolean)=>void) {
		if(this.isReady) {
			cb(this.database !== null);
		}else{
			this.readyWaiters.push(cb);
		}
	}
	
	public pushModel(model:BaseModel.BaseModel, cb:(success:Boolean)=>void) {
		var collection = this.database.collection(model.getType());
		collection.updateOne({id:model.id}, model.toJSON(), {upsert:true, w:1}, function(err, result) {
			if (cb != null) {
				cb(!err);
			}
		});
	}
	
	public pullModel<T extends BaseModel.BaseModel>(id:string, model:T, cb:(success:T)=>void) {
		var collection = this.database.collection(model.getType());
		collection.findOne({id:id}, function(err, data) {
			if(!err && data){
				for(var key in data){
					model[key] = data[key];
				}
			} else {
				model = null;
			}
			if (cb != null) {
				cb(model);
			}
		});
	}
}

// Exporting an instance rather than a class will make a singleton
export = new Database();