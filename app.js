/*
================================================

███████╗██╗██████╗ ███████╗███████╗██╗  ██╗   ██╗    
██╔════╝██║██╔══██╗██╔════╝██╔════╝██║  ╚██╗ ██╔╝    
█████╗  ██║██████╔╝█████╗  █████╗  ██║   ╚████╔╝     
██╔══╝  ██║██╔══██╗██╔══╝  ██╔══╝  ██║    ╚██╔╝      
██║     ██║██║  ██║███████╗██║     ███████╗██║       
╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚═╝     ╚══════╝╚═╝       

========== Server Initialization ===============
*/

console.log("Compiling Firefly Server...");

// IISNode doesn't have a functional process.stdin
// Replace it so things dont complain
if(process.env.IISNODE_VERSION){ 
	process.__defineGetter__('stdin', function(){});
}

// This project uses TypeScript
// We compile at runtime
require('ts-node/register');

// This script is the node entry point
// But everything cool happens in firefly.ts
require("./firefly.ts");