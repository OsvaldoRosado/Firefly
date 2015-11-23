/*
================================================

███████╗██╗██████╗ ███████╗███████╗██╗  ██╗   ██╗    
██╔════╝██║██╔══██╗██╔════╝██╔════╝██║  ╚██╗ ██╔╝    
█████╗  ██║██████╔╝█████╗  █████╗  ██║   ╚████╔╝     
██╔══╝  ██║██╔══██╗██╔══╝  ██╔══╝  ██║    ╚██╔╝      
██║     ██║██║  ██║███████╗██║     ███████╗██║       
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝       

========== Unit Testing Framework ==============
*/

console.log("Running Firefly FlySwatter...");
console.log("----------------------");

// IISNode doesn't have a functional process.stdin
// Replace it so things dont complain
if(process.env.IISNODE_VERSION){ 
	process.__defineGetter__('stdin', function(){});
}

// This project uses TypeScript
// We compile at runtime
require('ts-node/register');

// Run everything in tests folder ending in .test.ts
require('recursive-readdir')('./tests/', 
	[function (file, stats){
		var suffix = ".test.ts"
		var hasSuffix = file.indexOf(suffix, file.length - suffix.length) !== -1;
		return !stats.isDirectory() && !hasSuffix;
	}], 
	function (err, files) {
		var failed = 0;
		for(var i=0; i<files.length; i++){
			var file = "./"+files[i];
			var test = require(file).run();
			if (!test.success) {
				failed = failed + 1;
				console.log(file+" failed. "+test.reason);
			}else{
				console.log(file+" succeeded.");
			}
		}
		console.log("----------------------");
		console.log("Testing complete. "+files.length+" test classes run. "+failed+" test classes failed.");
		
		// Give error code for npm
		if (failed != 0) {
			process.exit(1);
		} else {
			process.exit(0)
		}
	}
);