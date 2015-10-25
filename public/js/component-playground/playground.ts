/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Playground {

	class AppController {
		scope: ng.IScope;
		
		// Dummy data
		testUser1: FFUser;
		imageContent: FFLinkContent;
		imageContent2: FFLinkContent;
		videoContent: FFYoutubeContent;
		questionContent: FFQuestion;
			
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
				id: 1,
				type: FFContentType.Image,
				submitter: this.testUser1,
				timestamp: new Date().getTime(),
				upvotes: 3,
				flagged: 0,
				filename: "view.png",
				link: "/images/dummy/view.jpg"
			};
			
			this.imageContent2 = {
				id: 2,
				type: FFContentType.Image,
				submitter: this.testUser1,
				timestamp: new Date().getTime(),
				upvotes: 0,
				flagged: 0,
				filename: "montreal.png",
				text: "Great view from the top of Mont Royal",
				link: "/images/dummy/montreal.jpg"
			}
			
			this.videoContent = {
				id: 3,
				type: FFContentType.Video,
				submitter: this.testUser1,
				timestamp: new Date().getTime(),
				upvotes: 0,
				flagged: 0,
				title: "Beach House - On The Sea",
				youtubeId: "0qz0IJXQ720",
				channelTitle: "Sub Pop"
			}
			
			this.questionContent = {
				id: 4,
				type: FFContentType.Question,
				submitter: this.testUser1,
				timestamp: new Date().getTime(),
				upvotes: 0,
				flagged: 0,
				text: `Is there any reason at all to use Model-View-Controller
					instead of Model-View-ViewModel or whatever other sensible
					alternative?
				`,
				replies: [
					{
						id: 5,
						type: FFContentType.QuestionResponse,
						submitter: this.testUser1,
						timestamp: new Date().getTime(),
						upvotes: 0,
						flagged: 0,
						text: `No. Why would the model directly update the view?
							That makes no sense.
						`
					},
					{
						id: 6,
						type: FFContentType.QuestionResponse,
						submitter: this.testUser1,
						timestamp: new Date().getTime(),
						upvotes: 0,
						flagged: 0,
						text: `I mean, seriously, it doesn't reduce glue code it
							just makes sure every component has the same amount of glue.
						`
					}
				]
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
		})
		.config(["$sceProvider",function($sceProvider) {
			// Completely disable SCE so Youtube embeds will work.
			$sceProvider.enabled(false);
		}]);
}
