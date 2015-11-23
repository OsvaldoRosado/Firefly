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
		questionValid: boolean;

		expandedIndex: number;

		static $inject = ["$scope", "$http"];
		constructor($scope, $http){
			this.scope = $scope;
			this.http = $http;

			this.expandedIndex = -1;
			this.questionText = "";
			this.questionValid = true;

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
			
			if (!(<ViewerApp.AppController>this.scope['app']).isLoggedIn) {
				var app = <ViewerApp.AppController>this.scope['app'];
				app.login().then(this.askQuestion.bind(this));
				return
			}

			// Validate the question
			if (this.questionText.length < 1) {
				return this.questionValid = false;
			}
			this.questionValid = true;

			// Build a whole FFQuestion
			// This seems unsustainable but we'll see how it goes
			var question:FFQuestion = {
				id: undefined,
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
				if(!(<any>data).success) {
					alert("COULD NOT ASK QUESTION");
				}
			});
		}

		/**
		 * Posts a reply to a question
		 */
		reply(data: string, questionId: string){
			if (data.length < 1) { return; }
			
			if (!(<ViewerApp.AppController>this.scope['app']).isLoggedIn) {
				var app = <ViewerApp.AppController>this.scope['app'];
				app.login().then(this.reply.bind(this, data, questionId));
				return
			}

			var replyObj: FFTextContent = {
				id: undefined,
				text: data,
				timestamp: new Date().getTime(),
				presentationId: this.parentApp.presentationInstance.presentationId,
				submitter: <FFUser>{ id: "-1", name: "Anonymous User" },
				type: FFContentType.Question,
				upvotes: 0,
				flagged: 0
			};

			new Shared.ReplyQuestionForPresentationInstance(
				this.http, questionId, replyObj
			).then((data) => {
				// not a great practice for searching, but given the expected
				// scale of the app, this'll do
				for (var i = 0; i < this.parentApp.content.length; i++){
					if(this.parentApp.content[i].id === questionId){
						this.parentApp.content[i] = (<any>data).data;
						break
					}
				}
			});
		}

		/**
		 * Expands a question
		 */
		expandItem(index: number) {
			if (this.expandedIndex == index) {return this.expandedIndex = -1};
			this.expandedIndex = index;
		}
	}

}
