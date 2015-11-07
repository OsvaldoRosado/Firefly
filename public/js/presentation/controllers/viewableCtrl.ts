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
	
	export interface Overlay extends Slide {
		isVideo: boolean;
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

		overlayActive: boolean;
		overlay: PresentationApp.Overlay;

		question: FFQuestion;
		qaActive: boolean;
		
		accessLink: string;

		static $inject = ["$scope"];
		constructor($scope: ng.IScope){
			this.scope = $scope;
			
			this.slides = [];
			this.isLoading = false;

			// Other components communicate with this one through window.postMessage
			// This setup cuts down on the number of requests to the server and ensures
			// that the presentation stays in perfect sync with the presenter view.
			window.addEventListener("message", (event) => {
				if (event.origin !== Config.HOST) { return; }
				var order = JSON.parse(event.data);
				switch(order.action){

					case "changeSlide":
						this.changeSlide(order.data);
						break;

					case "showOverlay":
						this.showOverlay(order.data, false);
						break;

					case "showOverlayVideo":
						this.showOverlay(order.data, true);
						break;
					
					case "hideOverlay":
						this.hideOverlay();
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
		
		// Proceed to a new slide
		changeSlide(url: string, forwards: boolean = true) {
			if (this.overlayActive) {
				this.hideOverlay();
				setTimeout(this.reallyChangeSlide.bind(this, url, forwards), 800);
			} else {
				this.reallyChangeSlide(url, forwards);
			}
		}
			
		private reallyChangeSlide(url: string, forwards: boolean = true) {
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
			if (isVideo){
				this.isLoading = true;
				
				// Make a video overlay
				this.overlay = {
					url: url,
					width: 1280, // Hard coded to 16:9
					height: 720,
					isVideo: true
				};
				
				// Wait a bit for the embed to load
				setTimeout(()=>{
					this.scope.$apply(()=>{
						this.isLoading = false;
						this.overlayActive = true;
					});
				}, 1000);
				
			
			// Right now, everything that isn't a video is an image
			} else {
				var overlayImage = new Image;
				overlayImage.addEventListener("load", ()=> {
					this.scope.$apply(()=>{
						this.isLoading = false;
						
						// Make an image overlay for Angular
						this.overlay = {
							url: url,
							width: overlayImage.width,
							height: overlayImage.height,
							isVideo: false
						};
						this.overlayActive = true;
					});
				});
				
				this.isLoading = true;
				overlayImage.src = url;
			}
		}
		
		// Hide the overlay (pretty self-explanatory really)
		hideOverlay(){
			this.overlayActive = false;
						
			// Clear the content after a short time
			setTimeout(()=>{
				this.scope.$apply(()=>{
					this.overlay = undefined;
				});
			}, 500);
		}
	}
}