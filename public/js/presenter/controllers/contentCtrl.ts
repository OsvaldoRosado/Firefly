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
					id: "1",
					presentationId: "1",
					type: FFContentType.Image,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 3,
					flagged: 0,
					filename: "crcCards.png",
					text: "This CRC card application looks useful.",
					link: "/images/dummy/crcCards.jpg"
				},
				<FFGenericContent> {
					id: "7",
					presentationId: "1",
					type: FFContentType.Image,
					submitter: testUser2,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					filename: "complicatedClassDiagram.png",
					text: "This class diagram seems like an example of one that's too complicated.",
					link: "/images/dummy/complicatedClassDiagram.png"
				},
				<FFGenericContent> {
					id: "3",
					presentationId: "1",
					type: FFContentType.Video,
					submitter: testUser2,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					title: "UML 2.0 Tutorial",
					youtubeId: "OkC7HKtiZC0",
					channelTitle: "Derek Banas"
				}
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
						},
						{
							id: "6",
							presentationId: "1",
							type: FFContentType.QuestionResponse,
							submitter: testUser2,
							timestamp: new Date().getTime(),
							upvotes: 0,
							flagged: 0,
							text: "It should fit on the card!"
						}
					]
				},
				{
					id: "8",
					presentationId: "1",
					type: FFContentType.Question,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 1,
					flagged: 0,
					text: "Is it okay if I can't fit the responsibilities of my class on one side of the card?",
					replies: [
						{
							id: "9",
							presentationId: "1",
							type: FFContentType.QuestionResponse,
							submitter: testUser2,
							timestamp: new Date().getTime(),
							upvotes: 0,
							flagged: 0,
							text: "That probably means your class is doing too much! It should only have a single responsibility."
						}
					]
				}
			];
		}

		// Horribly inefficient
		checkForContentContinuously(){
			new Shared.GetContentForPresentationInstance(this.http, this.presInstance.id)
				.then((result: ng.IHttpPromiseCallbackArg<Array<FFGenericContent>>) => {
					var _questions = [];
					// content not handled yet
					// var _content = [];
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