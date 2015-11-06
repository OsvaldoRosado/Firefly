module PresentationApp{
	
	class AppController {
		
		// In dummy mode, a fake slide is used and a console API is exposed
		// This is used for testing & development purposes
		dummyMode: boolean;
		
		constructor(){
			this.dummyMode = (window.location.hash === "#dummy");
			if (this.dummyMode) {
				console.log("Dummy mode enabled. Interact on window.dummy");
				window['dummy'] = this;
				
				// Set a dummy slide
				var command : Object = {
					action: "changeSlide",
					data: "./images/dummy/slide.png"
				}
				window.postMessage(JSON.stringify(command), Config.HOST);
				
				// Set a dummy access link
				var command : Object = {
					action: "showAccessLink",
					data: "onfirefly.ws"
				}
				window.postMessage(JSON.stringify(command), Config.HOST);
			}
		}
		
		// Dummy functions
		imageOverlay(){
			var command : Object = {
				action: "showOverlay",
				data: "./images/dummy/view.jpg"
			}
			window.postMessage(JSON.stringify(command), Config.HOST);
		}
		
		clearOverlay(){
			window.postMessage(JSON.stringify({action: "hideOverlay"}), Config.HOST);
		}
	}
	
	angular.module("presentation", [])
		.controller(Shared.Controllers)
		.controller(PresentationApp.Controllers)
		.controller("AppController", AppController)
		.directive(Shared.Directives)
		.filter("equals", function() {
			return function(value,  equals) : boolean {return value == equals;}
		})
		.config(["$sceProvider",function($sceProvider) {
			// Completely disable SCE so Youtube embeds will work.
			$sceProvider.enabled(false);
		}]);
};