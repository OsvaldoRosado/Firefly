export class BaseModel {
	private toJSON() {
		var output = {}, key:string;
		for (key in this) {
			if (this.hasOwnProperty(key) && !(key.indexOf("_") === 0)) {
				output[key] = this[key];
			}
		}
		return output;
	}
}