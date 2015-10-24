/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Playground {

	class AppController {
		scope: ng.IScope;
		
		// Dummy data
		testUser1: FFUser;
		imageContent: FFLinkContent;
		imageContent2: FFLinkContent;
			
		// Store the index of the currently expanded content item
		expandedIndex: number;
		
		// Basically just create all sorts of dummy data
		static $inject = ["$scope"];
		constructor($scope: ng.IScope) {
			this.expandedIndex = 1;

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
				link: "https://goo.gl/jQBTBR"
			};
			
			this.imageContent2 = {
				type: FFContentType.Image,
				submitter: this.testUser1,
				timestamp: new Date().getTime(),
				upvotes: 0,
				flagged: 0,
				title: "montreal.png",
				text: "Great view from the top of Mont Royal",
				link: "https://goo.gl/VJJujY"
			}
		}
		
		// Select a new item
		expandItem($scope: ng.IScope, index: number) {
			if (this.expandedIndex == index) {
				this.expandedIndex = -1;
			} else {
				this.expandedIndex = index;
			}
		}
	}

	var app = angular.module("playground", [])
		.controller(Shared.Controllers)
		.controller("AppController", AppController)
  		.directive(Shared.Directives)
		.filter("equals", function() {
			return function(value, equals) : boolean {return value == equals;}
		});
}
