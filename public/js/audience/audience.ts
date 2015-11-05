/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../shared/api.ts" />
/// <reference path="../shared/localWindow.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module AudienceApp {

	class AppController {
		scope: ng.IScope;
		http: ng.IHttpService;
	
		windowManager:Shared.LocalWindowManager;
		presentationInstance:FFPresentationInstance;
		presentation:FFPresentation;
		
		// Basically just create all sorts of dummy data
		static $inject = ["$scope","$http"];
		constructor($scope: ng.IScope, $http:ng.IHttpService) {
			this.scope = $scope;
			this.http = $http;
			
			// Get current instanceID
			var id = window.location.hash.replace("#","");
			if (id==""){
				window.location.href = "/";
				return;
			}
			
			// Get the presentation instance
			new Shared.GetPresentationStateAPIRequest($http,id).then((data:any, headers)=>{
				this.presentationInstance = data.data;
				new Shared.GetPresentationAPIRequest($http,this.presentationInstance.presentationId).then((data:any, headers)=>{
					this.presentation = data.data;
					this.managePresentationView();
				});
			});
			
			// Initialize the presentation view
			var presPreview = <HTMLIFrameElement>document.getElementById("presPreview");
			presPreview.style.height = Math.round(presPreview.offsetWidth * 9 / 16) + "px";
			this.windowManager = new Shared.LocalWindowManager([presPreview.contentWindow]);
		}
		
		private managePresentationView(){
			this.windowManager.commandAll(
				"changeSlide", this.presentation.slideUrls[this.presentationInstance.currentSlide]
			);
			if(this.presentationInstance.currentContentId && this.presentationInstance.currentContentId != "") {
				this.windowManager.postAll(this.presentationInstance.currentContentId);
			}
			window.setTimeout(()=>{
				new Shared.GetPresentationStateAPIRequest(this.http,this.presentationInstance.id).then((data:any, headers)=>{
					this.presentationInstance = data.data;
					this.managePresentationView();
				}
			)}, 300);
		}
	}

	var app = angular.module("audience", [])
		.controller(Shared.Controllers)
		.controller("AppController", AppController)
  		.directive(Shared.Directives)
		.filter("equals", function() {
			return function(value, equals) : boolean {return value == equals;}
		})
		.config(["$sceProvider",function($sceProvider) {
			// Completely disable SCE so Youtube embeds will work.
			$sceProvider.enabled(false);
		}]);
}
