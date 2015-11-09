/// <reference path="../../js/typings/angular/angular.d.ts" />
module Shared {

  export interface CollapsedScope extends ng.IScope {
    expanded: string;
    duration: string;
  }

}

module Shared.Directives {

  /**
    <collapse> contains content that can be hidden or shown at runtime and
    adds a little animation.
  */
  export function collapse(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        expanded: "=",
        duration: "@"
      },
      replace: false,

      // This directive is a dumb wrapper
      transclude: true,
      template: "<ng-transclude></ng-transclude>",

      // The only thing is does is expand or contract
      link: function(scope: Shared.CollapsedScope, jq: ng.IAugmentedJQuery, attrs: Object) {
        var element : HTMLElement = jq[0];
        var transclude : HTMLElement = <HTMLElement>element.querySelector("ng-transclude");
        transclude.style.display = "block";
        
        // Get the height of the inner element
        var getInnerHeight = function():number {
          var lastChild : HTMLElement = <HTMLElement>transclude.children[transclude.children.length - 1];
          if (!lastChild) {return transclude.getBoundingClientRect().height;}
          var marginBottom : number = parseInt(window.getComputedStyle(lastChild).marginBottom);
          return transclude.getBoundingClientRect().height + marginBottom;
        }

        // Make sure this actually does what it's supposed to do, visually
        element.style.overflow = "hidden";
        element.style.display = "block";

        // Start collapsed if requested
        if (!scope.expanded) {
          element.style.height = "0px";
        } else {
          setTimeout(function(){
            element.style.height = getInnerHeight()+"px";
          }, 100);
        }

        // Wait for the collapsedness value to change
        scope.$watch("expanded", function(newValue: boolean, oldValue: boolean) {
          if (newValue == oldValue) {return;} // This should never happen
          element.setAttribute("is-expanded", newValue.toString());

          // How big do we want this directive to be?
          var destinationHeight : string = "0px";
          if (newValue) {
            destinationHeight = (getInnerHeight()+"px") || "100%";
          }

          // Start CSS3 animation
          var duration = parseInt(scope.duration) || 200;
          element.style.transition = "height " + duration + "ms ease-out";
          setTimeout(function(){

            element.style.height = destinationHeight;
            setTimeout(function(){
              element.style.transition = "";
            }, 100 + duration);

          }, 100);
        });
      }
    };
  }
}
