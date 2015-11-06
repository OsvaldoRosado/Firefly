/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
module PresentationApp.Controllers {
	
	/**
	 * Angular controller for the interactive presentation. Not to be
	 * manipulated directly. The professor's instance receives orders via
	 * the Window object. The students' instance receives orders via REST API.
	 */
	export class ViewableCtrl{

		scope: ng.IScope;

		slideUrl: string;

		overlayUrl: string;
		overlayActive: boolean;
		overlayIsVideo: boolean;

		question: FFQuestion;
		qaActive: boolean;
		
		accessLink: string;

		static $inject = ["$scope"];
		constructor($scope: ng.IScope){
			this.scope = $scope;

			window.addEventListener("message", (event) => {
				if (event.origin !== Config.HOST) { return; }
				var order = JSON.parse(event.data);
				switch(order.action){

					case "changeSlide":
						this.slideUrl = order.data;
						this.overlayActive = this.qaActive = false;
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
		
		// Show an overlay
		showOverlay(url: string, isVideo: boolean) {
			
		}
	}
}