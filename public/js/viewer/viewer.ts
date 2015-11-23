/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../shared/api.ts" />
/// <reference path="../shared/localWindow.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module ViewerApp {

	export class AppController {
		scope: ng.IScope;
		http: ng.IHttpService;
		q: ng.IQService;

		// Navigation
		pageName: string;

		// Presentation Stuff
		instanceID: string;
		presentationInstance:FFPresentationInstance;
		presentation:FFPresentation;
		
		// Login Stuff
		showLoginModal: boolean;
		isLoggedIn: boolean;

		// Content
		content: FFGenericContent[];

		// Basically just create all sorts of dummy data
		static $inject = ["$rootScope", "$scope", "$http", "$q"];
		constructor($rootScope: ng.IScope, $scope: ng.IScope, $http:ng.IHttpService, $q:ng.IQService) {
			this.scope = $scope;
			this.http = $http;
			this.q = $q;
			this.content = []

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

				// Load the submitted content
				this.loadSubmittedContent();
			});
			
			// Check to see if the user is logged in
			new Shared.GetCurrentUserInfo($http).then((data:any)=>{
				this.isLoggedIn = data.success;
			});

			// Watch for page changes
			this.pageName = "/";
			$rootScope.$on('$routeChangeSuccess', (e, newVal)=> {
				this.pageName = newVal.$$route.originalPath;
			});
		}
		
		// Show the login modal when necessary
		public login() {
			this.showLoginModal = true;
			return this.q((resolve: ng.IQResolveReject<boolean>)=>{
				this.scope.$watch("app.isLoggedIn", (value: boolean)=>{
					console.log("CHANGED", value);
					if (value) {resolve(true);}
				})
			});
		}
		
		// Runs when the iFrame login changes in value
		public loginFrameChanged(e: Location) {
			if (e.pathname == "/api/success") {
				this.showLoginModal = false;
				this.isLoggedIn = true;
			}
		}

		private loadSubmittedContent(){
			new Shared.GetContentForPresentationInstance(this.http, this.presentationInstance.id).then((data)=>{
				var newContent : FFGenericContent[] = <FFGenericContent[]>(<any>data).data;
				for (var nI in newContent) {
					var nRow = newContent[nI];
					
					var isDuplicate = false;
					for (var rI in this.content) {
						var rRow = this.content[rI];
						if (nRow.id == rRow.id) {
							isDuplicate = true;
							break;
						}
					}
					if (isDuplicate) {continue;}
					
					this.content.splice(0, 0, nRow);
				}

				setTimeout(this.loadSubmittedContent.bind(this), 2000);
			});
		}
	}

	var app = angular.module("viewer", ["ngRoute", "ngAnimate"])
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
					templateUrl: 'public/templates/viewer/live.html',
					controller: ViewerApp.Controllers.LiveCtrl,
					controllerAs: "live"
				})
				.when('/ask', {
					templateUrl: 'public/templates/viewer/ask.html',
					controller: ViewerApp.Controllers.QuestionCtrl,
					controllerAs: "qc"
				})
				.when('/submit', {
					templateUrl: 'public/templates/viewer/submit.html'
				})
				.when('/submit/link', {
					templateUrl: 'public/templates/viewer/submitlink.html',
					controller: ViewerApp.Controllers.SubmitLinkController,
					controllerAs: "link"
				})
				.when('/notsupported', {
					templateUrl: 'public/templates/viewer/nothing.html',
				})
				.otherwise({
					redirectTo: '/'
				});

		}]);
}
