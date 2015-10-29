module PresentationApp.Controllers {
	export class ViewableCtrl{

		slideUrl: string;
		overlayUrl: string;
		overlayActive: boolean;
		question: FFQuestion;
		qaActive: boolean;

		constructor($scope: ng.IScope){
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
						this.overlayActive = true;
						break;

					case "hideOverlay":
						this.overlayUrl = undefined;
						this.overlayActive = false;
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