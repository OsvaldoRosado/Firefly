module Utils{

	// http://stackoverflow.com/a/11920807
	export function getUrlHashParam(key: string): string{
		var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
		return matches ? matches[1] : null;
	}

	export function processingServerImg(loc: string): string{
		return Config.PROCESSING_SERVER + "/" + Config.PROCESSING_SERVER_IMG_DIR 
			+ "/" + loc;
	}
}