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

		static $inject = ["$scope"];
		constructor($scope: ng.IScope){
			this.scope = $scope;

			window.addEventListener("message", (event) => {
				if (event.origin !== Config.HOST) { return; }
				var order = JSON.parse(event.data);
				switch(order.action){

					case "changeSlide":
						this.slideUrl = order.data;
						break;

					case "showOverlay":
						this.overlayUrl = order.data;
						this.qaActive = false;
						this.overlayIsVideo = false;
						this.overlayActive = true;
						break;

					case "showOverlayVideo":
						this.overlayUrl = order.data;
						this.qaActive = false;
						this.overlayActive = true;
						this.overlayIsVideo = true;
						break;
					
					case "hideOverlay":
						this.overlayUrl = undefined;
						this.overlayActive = false;
						this.overlayIsVideo = false;
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
				}
				$scope.$apply();
			});
		}
	}
}