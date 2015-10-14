module PresentationApp.Controllers{
	export class ViewableCtrl{

		slideUrl: string;
		overlayUrl: string;
		overlayActive: boolean;

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
						this.overlayActive = true;
						break;
					case "hideOverlay":
						this.overlayUrl = null;
						this.overlayActive = false;
						break;
				}
				$scope.$apply();
			});
		}
	}
}