/// <reference path="../../js/typings/angular/angular.d.ts" />
module Shared.Directives {

	/**
	 * `frame-load` is an attribute directive that watches for an iFrame's URL to change
   * Based on fix in: https://github.com/angular/angular.js/issues/2388 ; thanks fredsa
	 */
	export function frameLoad(): ng.IDirective {
    return {
			restrict: "A",
      link: ($scope: ng.IScope, element: ng.IRootElementService, attrs: any)=>{
        console.log(element);                          
        element.bind('load', function(evt) {
          $scope['loc'] = this.contentWindow.location;
          $scope.$apply(attrs['frameLoad']);                                            
        });                                                                       
      }
    }                                                                         
  };
}