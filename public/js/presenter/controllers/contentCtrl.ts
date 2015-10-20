module PresenterApp.Controllers {

	export class ContentCtrl {

		scope: ng.IScope;
		http: ng.IHttpService;

		content: UserContent[];
		questions: UserQuestion[];

		error: string;

		static $inject = ["$scope", "$http"];

		constructor($scope: ng.IScope, $http: ng.IHttpService) {
			this.scope = $scope;
			this.http = $http;

			// Test submissions
			this.content = [
				{ 
					url: "http://placehold.it/300x300", 
					caption: "Test caption",
					user: "Rick",
					score: 0
				}
			];

			// Test questions
			this.questions = [
				{
					text: "How do I art?", 
					user: "Mr. Meeseeks",
					score: 0,
					replies: [{
						text: "Look inside yourself",
						user: "Pensylvester",
						score: 0
					}]
				}
			];
		}
	}
}