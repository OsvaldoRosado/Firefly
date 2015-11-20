/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
/// <reference path="../viewer.ts" />
module ViewerApp.Controllers {

	/**
	 * Angular controller for showing the live content stream and presentation view
	 */
	export class LiveCtrl {
		scope: ng.IScope;
		http: ng.IHttpService;
		parentApp: ViewerApp.AppController;

		windowManager:Shared.LocalWindowManager;

		instanceID: string;
		presentationInstance:FFPresentationInstance;

		// Set to false when the user leaves the page, allows the HTTP requests to stop
		active: boolean;

		static $inject = ["$scope", "$http"];
		constructor($scope, $http){
			this.scope = $scope;
			this.http = $http;
			this.active = true;

			// Get the instance ID from the parent
			// This is the sort of strong coupling your mom warned you about.
			// But, it cuts out 2 API requests - Worth it!
			this.parentApp = <ViewerApp.AppController>$scope["app"];
			this.instanceID = this.parentApp.instanceID;

			// Initialize the presentation view
			var presPreview = <HTMLIFrameElement>document.getElementById("presPreview");
			//presPreview.style.height = "200px";
			this.windowManager = new Shared.LocalWindowManager([presPreview.contentWindow]);

			// Kick off this whole shebang once the parent has loaded the presentation
			if (this.parentApp.presentation !== undefined) {
				this.managePresentationView()
			} else {
				window.addEventListener("ffPresentationLoaded", this.managePresentationView.bind(this));
			}

			// Detect when the user leaves the page
			$scope.$on("$destroy", ()=> {
	    	this.active = false;
	    });
		}

		/**
		 * Continuously polls the server to update the presentation state
		 */
		private managePresentationView(){

			new Shared.GetPresentationStateAPIRequest(this.http,this.instanceID).then((data:any, headers)=>{
				this.presentationInstance = data.data;

				// Push changes to the view (in an iFrame)
				this.windowManager.commandAll(
					"changeSlide", this.parentApp.presentation.slideUrls[this.presentationInstance.currentSlide]
				);

				if(this.presentationInstance.currentContentId && this.presentationInstance.currentContentId != "") {
					this.windowManager.postAll(this.presentationInstance.currentContentId);
				}

				// Make a new request, if the page is still active
				if (this.active == false) {return;}
				window.setTimeout(this.managePresentationView.bind(this), 300);
			});
		}
	}

}
