import Database = require('../database');

export class BaseModel {
	public id:string;
	protected static _modelIdentifier:string = "UNKNOWN";
	
	constructor() {
		if (this.getType() == BaseModel._modelIdentifier) {
			throw new Error("Model subclass did not override _modelIdentifier or BaseModel is being used directly");
		}
	}
	
	/** Override JSON serialization to hide private properties */
	public toJSON() {
		var output = {}, key:string;
		for (key in this) {
			if (this.hasOwnProperty(key) && !(key.indexOf("_") === 0)) {
				output[key] = this[key];
			}
		}
		return output;
	}
	
	/** Function to allow BaseModel users to acquire a more specific data type name */
	public getType():string {
		return (<typeof BaseModel>this.constructor)._modelIdentifier;
	}
	
	/** Function to load model contents from database with an ID */
	public static fromID<T extends BaseModel>(id:string, cb:(data:T)=>void) {
		var model = new this();
		Database.pullModel(id,model,cb);
	}
	
	/** Function to load model contents from database with a match object */
	public static fromMatchObject<T extends BaseModel>(match:any, cb:(data:T[])=>void) {
		var model = new this();
		Database.pullModels(match,model,cb);
	}
	
	/** Function to save model contents on database */
	protected save(cb:(ok:boolean)=>void) {
		Database.pushModel(this, cb);
	}
}