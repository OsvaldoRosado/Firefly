/// <reference path="../../shared/api.ts" />
module PresenterApp.Controllers{
	
	class GetPresentationAPIRequest extends Shared.APIRequest<FFPresentation> {
		constructor($http: ng.IHttpService, presentationId: string) {
			super($http, "/getPresentationFromId/" + presentationId, {});
		}
	}
	
	export class SlideCtrl{

		scope: ng.IScope;
		http: ng.IHttpService;

		presRunning: boolean;
		presWindow: Window;

		presName: string;
		currentSlide: number;
		slideCount: number;
		slideUrls: string[];

		currentOverlay: string;
		currentQA: FFQuestion;

		error: string;

		static $inject = ["$scope", "$http"];
		constructor($scope: ng.IScope, $http: ng.IHttpService) {
			this.scope = $scope;
			this.presRunning = false;

			var sampleId = "59227f68-0818-4493-91df-c4b065a5011b-2";
			new GetPresentationAPIRequest($http, sampleId)
				.then((result: ng.IHttpPromiseCallbackArg<FFPresentation>) => {
					var pres = result.data;
					this.currentSlide = 0;
					this.slideCount = pres.slideCount;
					this.presName = pres.name;
					this.slideUrls = pres.slideUrls;
				}, () => this.error = "Your presentation was not found!");
		}


		presCommand(action: string, data: string) {
			this.presWindow.postMessage(
				angular.toJson({action: action,  data: data}),
				Config.HOST
			);
		}

		updateSlide(){
			this.presCommand("changeSlide", this.slideUrls[this.currentSlide]);
		}

		startPresentation(){
			this.presRunning = true;
			this.presWindow = window.open(
				"presentation.html", this.presName, "width=802,height=450"
			);
			setTimeout(() => this.updateSlide(), 1000);
		}

		prevSlide() {
			this.currentSlide--;
			this.updateSlide();
		}

		nextSlide(){
			this.currentSlide++;
			this.updateSlide();
		}

		toggleOverlay(url: string){
			if (url !== this.currentOverlay) {
				this.currentOverlay = url;
				this.presCommand("showOverlay", url);
			} else {
				this.currentOverlay = undefined;
				this.presCommand("hideOverlay", "");
			}
		}

		// TODO: implement showReplies
		toggleQASidebar(question: FFQuestion, showReplies: boolean){
			if(!this.currentQA || this.currentQA.text !== question.text){
				this.currentQA = question;
				this.presCommand("showQASidebar", angular.toJson(question));
			} else {
				this.currentQA = undefined;
				this.presCommand("hideQASidebar", "");
			}
		}

	}
}