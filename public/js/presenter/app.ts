module PresenterApp{
	angular.module("presenter", [])
		.controller(Shared.Controllers)
		.controller(PresenterApp.Controllers)
		.directive(Shared.Directives)
		.filter("equals", function() {
			return function(value,  equals) : boolean {return value == equals;}
		})
		.config(["$sceProvider",function($sceProvider) {
			// Completely disable SCE so Youtube embeds will work.
			$sceProvider.enabled(false);
		}]);
}