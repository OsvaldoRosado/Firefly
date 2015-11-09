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
		
		static $inject = ["$scope","$http"];
		constructor($scope, $http){
			this.scope = $scope;
			this.http = $http;
			
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
		}
		
		/**
		 * Continuously polls the server to update the presentation state
		 */
		private managePresentationView(){
			
			new Shared.GetPresentationStateAPIRequest(this.http,this.instanceID).then((data:any, headers)=>{
				if (JSON.stringify(data.data) != JSON.stringify(this.presentationInstance)) {
					this.presentationInstance = data.data;
					
					// Push changes to the view (in an iFrame)
					this.windowManager.commandAll(
						"changeSlide", this.parentApp.presentation.slideUrls[this.presentationInstance.currentSlide]
					);
					
					if(this.presentationInstance.currentContentId && this.presentationInstance.currentContentId != "") {
						this.windowManager.postAll(this.presentationInstance.currentContentId);
					}
				}
				
				// Make a new request
				window.setTimeout(this.managePresentationView.bind(this), 300);
			});
		}
	}
	
}