/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />

module PresentationApp {
	
	export interface Slide {
		url: string;
		width: number;
		height: number;
	}
	
}

module PresentationApp.Controllers {
	
	/**
	 * Angular controller for the interactive presentation. Not to be
	 * manipulated directly. The professor's instance receives orders via
	 * the Window object. The students' instance receives orders via REST API.
	 */
	export class ViewableCtrl{

		scope: ng.IScope;

		slides: Array<PresentationApp.Slide>;
		isLoading: boolean;

		overlayUrl: string;
		overlayActive: boolean;
		overlayIsVideo: boolean;

		question: FFQuestion;
		qaActive: boolean;
		
		accessLink: string;

		static $inject = ["$scope"];
		constructor($scope: ng.IScope){
			this.scope = $scope;
			
			this.slides = [];
			this.isLoading = false;

			window.addEventListener("message", (event) => {
				if (event.origin !== Config.HOST) { return; }
				var order = JSON.parse(event.data);
				switch(order.action){

					case "changeSlide":
						this.changeSlide(order.data);
						break;

					case "showOverlay":
						this.overlayUrl = order.data;
						this.qaActive = this.overlayIsVideo = false;
						this.overlayActive = true;
						break;

					case "showOverlayVideo":
						this.overlayUrl = order.data;
						this.qaActive = false;
						this.overlayActive = this.overlayIsVideo = true;
						break;
					
					case "hideOverlay":
						this.overlayUrl = undefined;
						this.overlayActive = this.overlayIsVideo = false;
						break;

					case "showQASidebar":
						this.question = JSON.parse(order.data);
						this.overlayActive = false;
						this.qaActive = true;
						break;
						
					case "hideQASidebar":
						this.question = undefined;
						this.qaActive = false;
						break;

					case "showAccessLink":
						this.accessLink = order.data;
						
						// Make sure the box is updated to footer size
						setTimeout(function(){
							window.dispatchEvent(new Event("updateFloatingContent"));
						},10);
						break;
				}
				$scope.$apply();
			});
		}
		
		// Proceed to the next slide
		changeSlide(url: string, forwards: boolean = true) {
			
			// First step is to load the image
			var slideImage = new Image;
			slideImage.addEventListener("load", ()=> {
				this.scope.$apply(()=>{
					this.isLoading = false;
					
					// Make a slide object and send it off to Angular
					this.slides.push({
						url: url,
						width: slideImage.width,
						height: slideImage.height
					});
				});
			});
			
			this.isLoading = true;
			slideImage.src = url;
		}
		
		// Show an overlay
		showOverlay(url: string, isVideo: boolean) {
			
		}
	}
}