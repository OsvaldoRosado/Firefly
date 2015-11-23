/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared.Directives {

	/**
	 * <ff-content> intelligently displays raw user submitted content. It changes format based
	 * on the size of the box, condensing down to an icon if necessary.
	 */
	export function ffContent(): ng.IDirective {
		return {
			restrict: "E",
			scope: true,
			bindToController: {
				content: "=",
				thumbnail: "="
			},
			controller: Shared.Controllers.FFContentViewController,
			controllerAs: "cview",
			replace: false,

			templateUrl: "public/directives/ff-content/template.html"
		}
	}
}

module Shared.Controllers {

	/**
	 * This controller makes decisions about how to render FFGenericContent objects
	 * for <ff-content>, including generating thumbnails and embed codes.
	 */
	export class FFContentViewController {
		content: FFGenericContent;
		thumbnail: boolean;

		// These are easier to read in the HTML because the enum doens't carry over.
		isImage: boolean;
		isVideo: boolean;

		// Anything smaller than this will display as a thumbnail.
		// This means things like questions will be reduced to an icon.
		thumbnailCutoffWidth: number = 150;

		// Helper functions for youtube videos
		getThumbnail() {
			return `http://img.youtube.com/vi/${(<FFYoutubeContent>this.content).youtubeId}/0.jpg`;
		}
		getEmbedCode() {
			return `http://www.youtube.com/embed/${(<FFYoutubeContent>this.content).youtubeId}`;
		}

		// Watch for the content or element size changing
		static $inject = ["$scope"];
		constructor($scope: ng.IScope) {
			if (this.content) {
				this.updateRenderDetails()
			}

			// This line here makes me very sad as a person
			$scope.$watch(
				function(){return this.content && this.content['timestamp'];}.bind(this),
				this.updateRenderDetails.bind(this)
			);
		}

		// Make decisions about the HTML output based on the content
		updateRenderDetails() {
			if (this.content == undefined) {return;}

			// Give the template a hand
			this.isImage = this.content.type == FFContentType.Image;
			this.isVideo = this.content.type == FFContentType.Video;

			if ((<FFYoutubeContent>this.content).youtubeId !== undefined) {
				this.renderYouTube(<FFYoutubeContent>this.content);
			}
		}

		// Fill out YouTube content data
		renderYouTube(content: FFYoutubeContent) {
			content.thumbnail = this.getThumbnail();
			content.embed = this.getEmbedCode();
		}

	}
}
