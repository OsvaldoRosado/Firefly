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

			this.content = [
				<FFGenericContent> {
					id: "1",
					type: FFContentType.Image,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 3,
					flagged: 0,
					filename: "view.png",
					link: "/images/dummy/view.jpg"
				},
				<FFGenericContent> {
					id: "7",
					type: FFContentType.Image,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					filename: "montreal.png",
					text: "Great view from the top of Mont Royal",
					link: "/images/dummy/montreal.jpg"
				},
				<FFGenericContent> {
					id: "3",
					type: FFContentType.Video,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					title: "Beach House - On The Sea",
					youtubeId: "0qz0IJXQ720",
					channelTitle: "Sub Pop"
				}
			];

			// Test questions
			this.questions = [
				{
					id: "4",
					type: FFContentType.Question,
					submitter: testUser1,
					timestamp: new Date().getTime(),
					upvotes: 0,
					flagged: 0,
					text: `Is there any reason at all to use Model-View-Controller
						instead of Model-View-ViewModel or whatever other sensible
						alternative?
					`,
					replies: [
						{
							id: "5",
							type: FFContentType.QuestionResponse,
							submitter: testUser1,
							timestamp: new Date().getTime(),
							upvotes: 0,
							flagged: 0,
							text: `No. Why would the model directly update the view?
								That makes no sense.
							`
						},
						{
							id: "6",
							type: FFContentType.QuestionResponse,
							submitter: testUser1,
							timestamp: new Date().getTime(),
							upvotes: 0,
							flagged: 0,
							text: "I mean, seriously, it doesn't reduce glue code it just makes sure every component has the same amount of glue."
						}
					]
				}
			];
		}
	}
}