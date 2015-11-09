/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../shared/api.ts" />
/// <reference path="../shared/localWindow.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module ViewerApp {

	export class AppController {
		scope: ng.IScope;
		http: ng.IHttpService;
		
		pageName: string;
		
		instanceID: string;
	
		presentationInstance:FFPresentationInstance;
		presentation:FFPresentation;
		
		// Basically just create all sorts of dummy data
		static $inject = ["$rootScope", "$scope", "$http"];
		constructor($rootScope: ng.IScope, $scope: ng.IScope, $http:ng.IHttpService) {
			this.scope = $scope;
			this.http = $http;
			
			// Get current instanceID
			var params = window.location.search;
			var id = this.instanceID = params.split("&")[0].split("=")[1];
			
			// Get the presentation instance
			new Shared.GetPresentationStateAPIRequest($http,id).then((data:any, headers)=>{
				this.presentationInstance = data.data;
				new Shared.GetPresentationAPIRequest($http,this.presentationInstance.presentationId).then((data:any, headers)=>{
					this.presentation = data.data;
					window.dispatchEvent(new Event("ffPresentationLoaded"));
				});
			});
			
			// Watch for page changes
			this.pageName = "/";
			$rootScope.$on('$routeChangeSuccess', (e, newVal)=> {
				this.pageName = newVal.$$route.originalPath;
			});
		}
	}

	var app = angular.module("viewer", ["ngRoute"])
		.controller(Shared.Controllers)
		.controller(ViewerApp.Controllers)
		.controller("AppController", AppController)
  		.directive(Shared.Directives)
		.filter("equals", function() {
			return function(value, equals) : boolean {return value == equals;}
		})
		.config(["$sceProvider","$routeProvider", function($sceProvider, $routeProvider) {
		
			// Completely disable SCE so Youtube embeds will work.
			$sceProvider.enabled(false);
			
			// Set up routes
			$routeProvider
				.when('/', {
					templateUrl: 'templates/viewer/live.html',
					controller: ViewerApp.Controllers.LiveCtrl,
					controllerAs: "live"
				})
				.when('/ask', {
					templateUrl: 'templates/viewer/ask.html',
					controller: ViewerApp.Controllers.LiveCtrl,
					controllerAs: "live"
				})
				.when('/submit', {
					templateUrl: 'templates/viewer/submit.html',
					controller: ViewerApp.Controllers.LiveCtrl,
					controllerAs: "live"
				})
				.otherwise({
					redirectTo: '/'
				});
			
		}]);
}
