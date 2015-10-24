module Playground {

	class AppController {
		testUser1: FFUser;

		imageContent: FFLinkContent;

		// Basically just create all sorts of dummy data
		constructor() {

			this.testUser1 = {
				id: 1,
				name: "Keaton Brandt"
			};

			this.imageContent = {
				type: FFContentType.Image,
				submitter: this.testUser1,
				timestamp: new Date().getTime(),
				upvotes: 3,
				flagged: 0,
				title: "view.png",
				link: "https://lh3.googleusercontent.com/Ta9OV6qh8vAUcPWPat5M2e6IgXjVDbVUdMX1qXxTPWNJyPybi339G8nFjnlO1c4FaafgtZEP0guYSbu9IG3du3TQBgo6hofue34C4BXZ_v0Rg51a9FOguC9juA7YBaLAoltsOuXRK4SvGk14ukg2ISyvBxH3xE69GgelAmeLXX3jIyDxaBmDT4cV5r73w1F-MOXF1o1gPUN8rQMcrkQ0AH4NJPmYR8ERyyfq7SrQMjlzfFFyxuh4eji86ijHK8rN87gyyF-HwTxoT0xahYDK_kLtFNTJJTz7VE7w6Zb_pA9TCX1Or0hrQsnPwUdnsArv081F04bmjrSwipKccvRjqfMaQXl970g100GuGLiq7n7GV2lgJy6jjpPfdb2_M5BaSJGiFHf33gEWI7W22KdySSQE5aWfwuDYVSj8Dg6OXj3fqASqTeb1KOBzAguDVwGkApDzhv42s4AY_ypkq6vV9RRmf-YLIUoNWScHUnqoMzDaPC07Mz86L3k0V_D6rv3JCyZRk4Cp8ss8BSKFVBSWa5pAzgVaLz9t-tbJRyVaawoy=w794-h590-no"
			};
		}
	}

	var app = angular.module("playground", [])
		.controller(Shared.Controllers)
		.controller("AppController", AppController)
  	.directive(Shared.Directives);
}
