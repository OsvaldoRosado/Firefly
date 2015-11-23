/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
/// <reference path="./api.ts" />

module Shared {

	export interface FFContentDisplayAttr {
		content: FFGenericContent;
		expanded: boolean;
		showThumbnail?: boolean;
	}

}

module Shared.Directives {

	export function ffContentBox(): ng.IDirective {
		return {
			restrict: "E",
			scope: true,
			bindToController: {
				content: "=",
				showThumbnail: "=",
				expanded: "=",
				isForm: "=",
				replyValid: "=",
				onToggle: "&",
				onReply: "&"
			},
			controller: Shared.Controllers.FFContentBoxController,
			controllerAs: "cc",
			replace: true,

			templateUrl: "public/directives/ff-content-box/template.html"
		}
	}
}

module Shared.Controllers {

	export class FFContentBoxController {
		scope: ng.IScope;
		http: ng.IHttpService;

		// Bound from scope
		content: FFGenericContent;
		showThumbnail: boolean;
		isFlagged: boolean;
		userVoted: boolean;
		expanded: boolean;
		onToggle: Function;
		onReply: Function;

		// Template rendering settings
		isQuestion: boolean;


		// Watch for the content or element size changing
		static $inject = ["$scope", "$element", "$http"];
		constructor($scope: ng.IScope, $element: ng.IAugmentedJQuery, $http: ng.IHttpService) {
			this.scope = $scope;
			this.http = $http;

			// Analyze the content for ideal display
			this.isFlagged = this.content.flagged;
			this.userVoted = false;
			this.isQuestion = (this.content.type == FFContentType.Question);

			// If the user specifies a value, our work is done
			if (this.showThumbnail !== undefined) {return;}

			// Otherwise the thumbnail depends on the size of the object
			var element : HTMLElement = $element[0];
			this.resize(element.offsetWidth);

			$element.on("resize", function(){
				this.resize(element.offsetWidth);
			}.bind(this));
		}

		// Resize element
		resize(width: number) {
			this.showThumbnail = (
				this.content.type == FFContentType.Image ||
				this.content.type == FFContentType.Video
			) && width > 300;
		}

		// Upvote handler
		upvoteContent() {
			if (this.userVoted) { return; }
			new UpvoteAPIRequest(this.http, this.content.id).then((res)=> {
				this.content.upvotes += 1;
				this.userVoted = true;
			}).catch(() => {
				this.content.upvotes -= 1;
			});
		}

		// Flag handler
		flagContent() {
			if (this.isFlagged) { return; }
			new FlagAPIRequest(this.http, this.content.id).catch(()=> {
				alert("ERROR: Could not flag content. It may already be deleted");
			}).then((res)=> {
				this.isFlagged = true;
			});
		}

		// Share handler
		shareContent() {

			// Get the link
			var link = "";
			if ((<FFYoutubeContent>this.content).youtubeId !== undefined) {
				link=`https://www.youtube.com/watch?v=${(<FFYoutubeContent>this.content).youtubeId}`;
			} else if ((<FFLinkContent>this.content).link !== undefined) {
				link = (<FFLinkContent>this.content).link;
			} else if ((<FFTextContent>this.content).text !== undefined) {

				// Text documents don't have a link so we try this crazier method instead
				// It may not work in browsers with popup blockers
				var w = window.open("", "_blank");
				w.document.write((<FFTextContent>this.content).text);
				return;
			}

			// Open the link in a new tab
			window.open(link, "_blank");
		}
	}
}
