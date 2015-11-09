/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
module PresenterApp.Controllers {

	/**
	 * Angular controller for showing student-submitted content and questions
	 * to the Professor.
	 */
	export class ContentCtrl {

		scope: ng.IScope;
		http: ng.IHttpService;

		presInstance: FFPresentationInstance;

		content: Array<FFGenericContent>;
		questions: Array<FFQuestion>;

		error: string;

		expandedIndex: boolean;

		static $inject = ["$scope", "$http"];

		constructor($scope: ng.IScope, $http: ng.IHttpService) {
			this.scope = $scope;
			this.http = $http;

			this.scope.$on("instanceCreated", (event, value) => {
				this.presInstance = value;
				this.checkForContentContinuously();
			});
				
			// Test stuff, all temporary
			var testUser1 = {
				id: "1",
				name: "Keaton Brandt"
			};
			var testUser2 = {
				id: "2",
				name: "Liam Jones"
			};

			this.content = [
				<FFGenericContent> {
					id: "9",
					presentationId: "1",
					type: FFContentType.Image,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					filename: "presenter-mock.png",
					text: "Page from our doc detailing the presenter view",
					link: "/images/dummy/presenter-mock.png"
				},
				<FFGenericContent> {
					id: "8",
					presentationId: "1",
					type: FFContentType.Image,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					filename: "mobile-upload.png",
					text: "This is what people should see when they submit content",
					link: "/images/dummy/mobile-upload.png"
				},
				<FFGenericContent> {
					id: "7",
					presentationId: "1",
					type: FFContentType.Image,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					filename: "mobile-live.png",
					text: "Mockup of the main view the audience sees.",
					link: "/images/dummy/mobile-live.png"
				},
				<FFGenericContent> {
					id: "4",
					presentationId: "1",
					type: FFContentType.Video,
					submitter: testUser2,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					title: "Bueller, Bueller",
					youtubeId: "f4zyjLyBp64",
					channelTitle: "blc3211"
				},
			];

			// Test questions
			this.questions = [
				{
					id: "4",
					presentationId: "1",
					type: FFContentType.Question,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 3,
					flagged: 0,
					text: "What would be a good number of collaborators to have?",
					replies: [
						{
							id: "5",
							presentationId: "1",
							type: FFContentType.QuestionResponse,
							submitter: testUser2,
							timestamp: new Date().getTime(),
							upvotes: 0,
							flagged: 0,
							text: "I think it might depend on how complicated your overall class structure is."
						}
					]
				}
			];
		}

		// Horribly inefficient
		checkForContentContinuously(){
			if (this.presInstance == undefined){
				return window.setTimeout(this.checkForContentContinuously.bind(this), 1000);
			}
			new Shared.GetContentForPresentationInstance(this.http, this.presInstance.id)
				.then((result: ng.IHttpPromiseCallbackArg<Array<FFGenericContent>>) => {
					var _questions = [];
					// content not handled yet
					// var _content = [];
					if (!result.data) {return;}
					result.data.forEach((submission) => {
						if (submission.type == FFContentType.Question) {
							_questions.push(submission);
						}
						else {
							//_content.push(submission);
						}
					});
					this.questions = _questions;
					//this.content = _content;

					window.setTimeout(this.checkForContentContinuously.bind(this), 1000);
				});
		}
	}
}