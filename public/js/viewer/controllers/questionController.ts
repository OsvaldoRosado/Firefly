/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
/// <reference path="../viewer.ts" />
module ViewerApp.Controllers {

	/**
	 * Angular controller for asking and viewing questions
	 */
	export class QuestionCtrl {
		scope: ng.IScope;
		http: ng.IHttpService;
		
		parentApp: ViewerApp.AppController;
		instanceID: string;
		
		questionText: string;
		
		expandedIndex: number;
		
		static $inject = ["$scope", "$http"];
		constructor($scope, $http){
			this.scope = $scope;
			this.http = $http;
			
			this.expandedIndex = -1;
			
			// Get the instance ID from the parent
			// This is the sort of strong coupling your mom warned you about.
			// But, it cuts out 2 API requests - Worth it!
			this.parentApp = <ViewerApp.AppController>$scope["app"];
			this.instanceID = this.parentApp.instanceID;
		}
		
		/**
		 * Submits the user's question to the server
		 */
		askQuestion(){
			
			// Build a whole FFQuestion
			// This seems unsustainable but we'll see how it goes
			var question:FFQuestion = {
				text: this.questionText,
				timestamp: new Date().getTime(),
				presentationId: this.parentApp.presentationInstance.presentationId,
				submitter: <FFUser>{id: "-1", name: "Anonymous User"},
				type: FFContentType.Question,
				upvotes: 0,
				flagged: 0,
				replies: []
			};
			
			// Send it to the server
			new Shared.PostContentForPresentationInstance(this.http, this.instanceID, question).then((data)=>{
				if((<any>data).success) {
					this.expandedIndex += 1;
					this.parentApp.content.splice(0, 0, question);
				}
			});
		}
		
		/**
		 * Expands a question
		 */
		expandItem(index: number) {
			this.expandedIndex = index;
		}
	}
	
}