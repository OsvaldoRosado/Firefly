/// <reference path="../shared/data-types.ts" />

import Base = require("./BaseModel")

class Presentation extends Base.BaseModel implements FFPresentation {
	// Follow FFPresentation common public interface
	public id: string;
	public submitter: FFUser;
	public timestamp: number = Math.floor(new Date().getTime()/1000);
	public slideCount: number = 0;
	public slides: string[] = [];
	
	// Internal variables
	private _presentationBase = "https://fireflypresentations.blob.core.windows.net/convert/";
	
	// Construct a presentation from an ID
	public constructor(id:string) {
		super();
		
		// Does id exist?
		if (!id) {
			return null;
		}
		
		// Is id in valid format?
		var idComponents = (<string>id).split("-")
		if (idComponents.length != 6) {
			return null;
		}
		
		// Fill variables
		this.slideCount = parseInt(idComponents[5]);
		this.id = idComponents.join("-").substr(0,id.length-(idComponents[5].length+1));
		for(var i=0; i<this.slideCount; i++){
			this.slides.push(this._presentationBase + this.id + "/img"+i+".jpg");
		}
	}
}

export = Presentation;