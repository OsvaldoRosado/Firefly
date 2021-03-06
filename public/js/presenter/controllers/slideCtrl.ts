/// <reference path="../../shared/api.ts" />
/// <reference path="../../shared/localWindow.ts" />
/// <reference path="../../../../shared/data-types.ts" />
module PresenterApp.Controllers {
	
	/**
	 * Angular controller for switching slides, placing overlays, and managing Q&A
	 */
	export class SlideCtrl{

		scope: ng.IScope;
		http: ng.IHttpService;

		presRunning: boolean;
		presWindows: Shared.LocalWindowManager;

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
						.then((result: ng.IHttpPromiseCallbackArg<FFPresentationInstance>) => {
							this.presInstance = result.data;
							this.scope.$broadcast("instanceCreated", this.presInstance);
						});

				}, () => this.error = "Your presentation was not found!");
		}

		postPresentationState(action, data){
			var blob = JSON.stringify({ action: action, data: data });
			new Shared.PostPresentationStateAPIRequest(
				this.http, this.presInstance.id, this.presInstance.currentSlide, blob
			).then(() => {});
		}

		changeInstanceContent(action, data){
			this.presWindows.commandAll(action, data);
			this.postPresentationState(action, data);
		}

		updateSlide() {
			this.presWindows.commandAll(
				"changeSlide", this.presentation.slideUrls[this.presInstance.currentSlide]
			);
			this.currentOverlay = this.currentQA = undefined;
			new Shared.PostPresentationStateAPIRequest(
				this.http, this.presInstance.id, this.presInstance.currentSlide
			).then(() => {});
		}

		startPresentation(){
			this.presRunning = true;
			var presPreview: HTMLIFrameElement = 
				<HTMLIFrameElement>document.getElementById("presPreview");

			this.presWindows = new Shared.LocalWindowManager([
				window.open("presentation.html", this.presentation.name, 
					"width=802,height=450"),
				presPreview.contentWindow
			]);

			setTimeout(() => {
				this.updateSlide();

				new Shared.GenerateShortInstanceURLAPIRequest(
					this.http, this.presInstance.id
				).then((result: ng.IHttpPromiseCallbackArg<string>) =>
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

		resetOverlay(){
			this.currentOverlay = undefined;
			this.changeInstanceContent("hideOverlay", "");
		}
		
		toggleOverlay(content: FFGenericContent){
			if(content.type == FFContentType.Image){
				var linkContent = <FFLinkContent> content;
				if (this.currentOverlay && this.currentOverlay.type == FFContentType.Image
					&& (<FFLinkContent>this.currentOverlay).link === linkContent.link) {
					this.resetOverlay();
				}
				else {
					this.currentOverlay = content;
					this.changeInstanceContent("showOverlay", linkContent.link);
				}
			}
			else if(content.type == FFContentType.Video){
				var vidContent = <FFYoutubeContent> content;
				if (this.currentOverlay && this.currentOverlay.type == FFContentType.Video
					&& (<FFYoutubeContent>this.currentOverlay).embed === vidContent.embed) {
					this.resetOverlay();
				}
				else {
					this.currentOverlay = content;
					this.presWindows.commandOne(0, "showOverlayVideo", vidContent.embed + "?autoplay=1");
					this.presWindows.commandOne(1, "showOverlayVideo", vidContent.embed);
					this.postPresentationState("showOverlayVideo", vidContent.embed);
				}
			}
		}

		toggleQASidebar(question: FFQuestion){
			if(!this.currentQA || this.currentQA.text !== question.text){
				this.currentQA = question;
				this.changeInstanceContent("showQASidebar", angular.toJson(question));
			} else {
				this.currentQA = undefined;
				this.changeInstanceContent("hideQASidebar", "");
			}
		}

		endPresentation(){
			this.presRunning = false;
			this.presWindows.closeAll();
		}
	}
}