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
			this.content = [];
			this.questions = [];

			this.scope.$on("instanceCreated", (event, value) => {
				this.presInstance = value;
				window.setTimeout(this.checkForContentContinuously.bind(this), 1000);
			});
		}

		/**
		 * Query the database every second for new content and questions to update
		 * the feed.
		 */
		checkForContentContinuously(){
			new Shared.GetContentForPresentationInstance(this.http, this.presInstance.id)
				.then((result: ng.IHttpPromiseCallbackArg<Array<FFGenericContent>>) => {
					var submissions = result.data;
					if (!submissions || !submissions.length) {
						window.setTimeout(this.checkForContentContinuously.bind(this), 1000);
						return;
					}

					var cInc = 0; // content iteration
					for (var sInc = 0; sInc < submissions.length; sInc++){
						var sub = submissions[sInc];
						if( sub.type == FFContentType.Question){
							
							var qsub = <FFQuestion>sub;
							if(this.questions.length === 0){
								this.questions.push(qsub);
								continue;
							}

							// I'm not proud of this, but it's the only way to edit
							// the replies of a question without resetting the whole object
							var found = false;
							for (var qInc = 0; qInc < this.questions.length; qInc++){
								var q = this.questions[qInc];
								if(q.id === qsub.id){
									if (q.replies.length < qsub.replies.length){
										q.replies = qsub.replies;
									}
									found = true;
									q.upvotes = qsub.upvotes;
									q.flagged = qsub.flagged;
								}
							}
							if(!found){
								this.questions.push(qsub);
							}
						}
						else {
							// content doesn't have replies (thank goodness)
							if (this.content.length <= cInc){
								this.content.push(sub)
							}
							else {
								this.content[cInc].upvotes = sub.upvotes;
								this.content[cInc].flagged = sub.flagged;
							}
							cInc++;
						}
					}
					window.setTimeout(this.checkForContentContinuously.bind(this), 1000);
				});
		}
	}
}