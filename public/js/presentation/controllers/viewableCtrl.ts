module PresentationApp.Controllers{
	export class ViewableCtrl{

		slideUrl: string;

		constructor($scope: ng.IScope){
			window.addEventListener("message", (event) => {
				if (event.origin !== Config.HOST) { return; }

				var order = JSON.parse(event.data);
				switch(order.action){
					case "changeSlide":
						this.slideUrl = order.data;
				}
				$scope.$apply();
			});

			window.parent.postMessage("ready", Config.HOST);
		}
	}
}