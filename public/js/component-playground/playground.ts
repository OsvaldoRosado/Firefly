/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Playground {

	class AppController {
		testUser1: FFUser;

		imageContent: FFLinkContent;
		imageContent2: FFLinkContent;

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
			
			this.imageContent2 = {
				type: FFContentType.Image,
				submitter: this.testUser1,
				timestamp: new Date().getTime(),
				upvotes: 0,
				flagged: 0,
				title: "montreal.png",
				text: "Great view from the top of Mont Royal",
				link: "https://lh3.googleusercontent.com/xk59JIhdsUAQQDJN8ZkUIfCvggThN3D9G0rn7gf8Uxj_n6QL3PeOgJH58-EWEhjthwItDzpEJoLHXLfjml0J3UWba5FcMukuPXfDkmM8v2nG0sSKoVF4bHssL-F-cZWYiYMdmANvRqgFAMEsf-6E6ZRLEKFRZaIWlPK8jv7GxfhA4ht1H8XlhQT6oBm6HreAzC0Yir5hdNnUvx9sOYsS7CL9Suew54r5aRTtk3YmptBLGoQQbKiFANu_mlbjLgZbFwFPc4DHur9BFLYwHK4CwtlkhEWd8Ql3upHop4lPxT-gjZ4ZYr0ha9RYf932d37Ij5q_Y0PZa7npQiDbDHZJQs1IiBZQ4RSt2ozfrR1VrZ1PgkY_q_a5N6evdSW7A58oxZv8-SHt80mBZ2_cbL5pofsXzxzol3iMrbIcNj0TUc_oL56RKNHljK2fvWD-n-u_9lRFC7hqMbd6C1ho4szurwmIXu2KZ7bZV7XU3jsImxUQG75d4CdyfWrTVcpbfqVoT5-z9mKS8ie-nHnUpoBAU3V3i6AYEH8b34E9lExz3kPS=w2362-h996-no"
			}
		}
	}

	var app = angular.module("playground", [])
		.controller(Shared.Controllers)
		.controller("AppController", AppController)
  	.directive(Shared.Directives);
}
