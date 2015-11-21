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

			this.content = [];
			this.questions = [];
		}

		/**
		 * Query the database every second for new content and questions to update
		 * the feed.
		 */
		checkForContentContinuously(){
			// TEMPORARY SOLUTION
			// Assumes submissions are always in the same order and never deleted.
			if (this.presInstance == undefined){
				return window.setTimeout(this.checkForContentContinuously.bind(this), 1000);
			}
			new Shared.GetContentForPresentationInstance(this.http, this.presInstance.id)
				.then((result: ng.IHttpPromiseCallbackArg<Array<FFGenericContent>>) => {
					var submissions = result.data;
					if (!submissions || !submissions.length) { return; }

					var qInc = 0; // question iteration
					var cInc = 0; // content iteration
					for (var sInc = 0; sInc < submissions.length; sInc++){
						var sub = submissions[sInc];
						if( sub.type == FFContentType.Question){
							var qsub = <FFQuestion>sub;
							if (this.questions.length <= qInc){
								this.questions.push(qsub);
							}
							else {
								if (this.questions[qInc].replies.length < qsub.replies.length){
									this.questions[qInc].replies = qsub.replies;
								}
							}
							qInc++;
						}
						else {
							// content doesn't have replies
							if (this.content.length <= cInc){
								this.content.push(sub)
							}
							cInc++;
						}
					}
					window.setTimeout(this.checkForContentContinuously.bind(this), 1000);
				});
		}
	}
}