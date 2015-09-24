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

// This project uses TypeScript
// We compile at runtime
require('typescript-require')({
    nodeLib: false,
    targetES5: true,
    exitOnError: true
});

// Make sure we dont have any old pre-compiled scripts
// Rimraf is essentially rm -rf
require("rimraf").sync("./tmp/");

// This script is the node entry point
// But everything cool happens in firefly.ts
require("./firefly.ts");