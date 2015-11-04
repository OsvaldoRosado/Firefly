/// <reference path="../../shared/api.ts" />
/// <reference path="../util/localWindow.ts" />
/// <reference path="../../../../shared/data-types.ts" />
module PresenterApp.Controllers {
	
	/**
	 * Angular controller for switching slides, placing overlays, and managing Q&A
	 */
	export class SlideCtrl{

		scope: ng.IScope;
		http: ng.IHttpService;

		presRunning: boolean;
		presWindows: PresenterApp.LocalWindowManager;

		presentation: FFPresentation;
		presInstance: FFPresentationInstance;

		currentOverlay: FFGenericContent;
		currentQA: FFQuestion;

		error: string;

		static $inject = ["$scope", "$http"];
		constructor($scope: ng.IScope, $http: ng.IHttpService) {
			this.scope = $scope;
			this.http = $http;
			this.presRunning = false;

			var id = window.location.hash.substr(1);
			new Shared.GetPresentationAPIRequest($http, id)
				.then((result: ng.IHttpPromiseCallbackArg<FFPresentation>) => {
					this.presentation = result.data;

					new Shared.GeneratePresentationInstanceAPIRequest($http, id)
						.then((result: ng.IHttpPromiseCallback<FFPresentationInstance>) => {
							this.presInstance = result.data;
						});

				}, () => this.error = "Your presentation was not found!");
		}

		updateSlide(){
			this.presWindows.commandAll(
				"changeSlide", this.presentation.slideUrls[this.presInstance.currentSlide]
			);
			new Shared.PostPresentationStateAPIRequest(
				this.http, this.presInstance.id, this.presInstance.currentSlide
			).then(() => {});
		}

		startPresentation(){
			this.presRunning = true;
			var presPreview: HTMLIFrameElement = 
				<HTMLIFrameElement>document.getElementById("presPreview");

			this.presWindows = new PresenterApp.LocalWindowManager([
				window.open("presentation.html", this.presentation.name, 
					"width=802,height=450"),
				presPreview.contentWindow
			]);

			setTimeout(() => {
				this.updateSlide();

				new Shared.GenerateShortInstanceURLAPIRequest(
					this.http, this.presInstance.id
				).then((result: ng.IHttpPromiseCallback<string>) =>
					this.presWindows.commandAll("showAccessLink", result.data
				));
				
				// iframe height can't be set to show whole screen, must set
				// manually instead
				presPreview.style.height = 
					Math.round(presPreview.offsetWidth * 9 / 16) + "px";
			}, 1000);
		}

		prevSlide() {
			this.presInstance.currentSlide--;
			this.updateSlide();
		}

		nextSlide(){
			this.presInstance.currentSlide++;
			this.updateSlide();
		}

		toggleOverlay(content: FFGenericContent){
			if (!this.currentOverlay || content.id !== this.currentOverlay.id) {
				this.currentOverlay = content;
				if(content.type == FFContentType.Image){
					var linkContent = <FFLinkContent> content;
					this.presWindows.commandAll("showOverlay", linkContent.link);
				}
				else if(content.type == FFContentType.Video){
					var vidContent = <FFYoutubeContent> content;
					this.presWindows.commandAll("showOverlayVideo", vidContent.embed);
				}
			} else {
				this.currentOverlay = undefined;
				this.presWindows.commandAll("hideOverlay", "");
			}
		}

		toggleQASidebar(question: FFQuestion){
			if(!this.currentQA || this.currentQA.text !== question.text){
				this.currentQA = question;
				this.presWindows.commandAll("showQASidebar", angular.toJson(question));
			} else {
				this.currentQA = undefined;
				this.presWindows.commandAll("hideQASidebar", "");
			}
		}

		endPresentation(){
			this.presRunning = false;
			this.presWindows.closeAll();
		}
	}
}