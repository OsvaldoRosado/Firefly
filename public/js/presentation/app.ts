module PresentationApp{
	angular.module("presentation", [])
		.controller(Shared.Controllers)
		.controller(PresentationApp.Controllers)
		.directive(Shared.Directives)
		.filter("equals", function() {
			return function(value,  equals) : boolean {return value == equals;}
		})
		.config(["$sceProvider",function($sceProvider) {
			// Completely disable SCE so Youtube embeds will work.
			$sceProvider.enabled(false);
		}]);
};