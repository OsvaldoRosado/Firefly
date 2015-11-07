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
			}
		}
		
		// Dummy functions
		showAccessLink() {
			// Set a dummy access link
			var command : Object = {
				action: "showAccessLink",
				data: "onfirefly.ws"
			}
			window.postMessage(JSON.stringify(command), Config.HOST);
		}
		
		advanceSlide() {
			var command : Object = {
				action: "changeSlide",
				data: "./images/dummy/slide2.png"
			}
			window.postMessage(JSON.stringify(command), Config.HOST);
		}
		
		imageOverlay(){
			var command : Object = {
				action: "showOverlay",
				data: "./images/dummy/view.jpg"
			}
			window.postMessage(JSON.stringify(command), Config.HOST);
		}
		
		videoOverlay(){
			var command : Object = {
				action: "showOverlayVideo",
				data: "http://www.youtube.com/embed/0qz0IJXQ720"
			}
			window.postMessage(JSON.stringify(command), Config.HOST);
		}
		
		clearOverlay(){
			window.postMessage(JSON.stringify({action: "hideOverlay"}), Config.HOST);
		}
	}
	
	angular.module("presentation", ["ngAnimate"])
		.controller(Shared.Controllers)
		.controller(PresentationApp.Controllers)
		.controller("AppController", AppController)
		.directive(Shared.Directives)
		.config(["$sceProvider",function($sceProvider) {
			// Completely disable SCE so Youtube embeds will work.
			$sceProvider.enabled(false);
		}]);
};