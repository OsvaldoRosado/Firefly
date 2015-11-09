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

		content: Array<FFGenericContent>;
		questions: Array<FFQuestion>;

		error: string;

		expandedIndex: boolean;

		static $inject = ["$scope", "$http"];

		constructor($scope: ng.IScope, $http: ng.IHttpService) {
			this.scope = $scope;
			this.http = $http;

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
					presentationId: "1",
					type: FFContentType.Question,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 3,
					flagged: 0,
					text: "What would be a good number of collaborators to have?",
					replies: [
						{
							presentationId: "1",
							type: FFContentType.QuestionResponse,
							submitter: testUser2,
							timestamp: new Date().getTime(),
							upvotes: 0,
							flagged: 0,
							text: "I think it might depend on how complicated your overall class structure is."
						},
						{
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
					presentationId: "1",
					type: FFContentType.Question,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 1,
					flagged: 0,
					text: "Is it okay if I can't fit the responsibilities of my class on one side of the card?",
					replies: [
						{
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
	}
}