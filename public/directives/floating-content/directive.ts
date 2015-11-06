/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

/// <reference path="../../js/typings/angular/angular.d.ts" />
module Shared {

  export interface FloatingContentScope extends ng.IScope {
    floatX: string;
    floatY: string;
    contentWidth: string;
    contentHeight: string;
    size: string;
    element: HTMLElement;
    container: HTMLElement;
  }

}


module Shared.Directives {

  /**
    <floating-content> uses absolute positioning to fit content within its parent.
    It has a few different animations to spice things up.
  */
  export function floatingContent(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        floatX: "@",
        floatY: "@",
        contentWidth: "@",
        contentHeight: "@",
        size: "@"
      },
      replace: false,

      // This directive is a dumb wrapper
      transclude: true,
      template: "<ng-transclude></ng-transclude>",
      
      // But it does have a controller
      controller: Shared.Controllers.FloatingContentController,
      controllerAs: "cfv",

      // The only thing is does is expand or contract
      link: function(scope: ng.IScope, jq: ng.IAugmentedJQuery, attrs: Object) {
        var container : HTMLElement = scope['container'] = jq[0];
        var element = container.children[0]; if (!element) {return;}
        element = element.children[0]; if (!element) {return;}
        scope['element'] = element;
        
        var parent = container.parentElement;
        
        if (!parent) {return;}
        
        // Update the floating content layout
        function layout() {
          
          // Format the scope variables so it works with percents or decimals
          var floatX : number = parseFloat(scope['floatX']);
          if (floatX > 1) {floatX /= 100;}
          var floatY : number = parseFloat(scope['floatY']);
          if (floatY > 1) {floatY /= 100;}
          
          // Get the base content width and height
          var elementWidth = parseInt(scope['contentWidth'])
          var elementHeight = parseInt(scope['contentHeight'])
          
          // Get the size of the element and its parent
          var parentSize = parent.getBoundingClientRect();
          
          // Size the element
          if (scope['size']) {
            var scale = parseFloat(scope['size']);
          
            // Figure out aspect ratios
            var elementAspect = elementWidth / elementHeight;
            var parentAspect = parentSize.width / parentSize.height;
            
            // Figure out the size
            if (elementAspect > parentAspect) { // Element is wider than parent
              elementWidth = parentSize.width * scale;
              elementHeight = elementWidth / elementAspect;
            } else {
              elementHeight = parentSize.height * scale;
              elementWidth = elementHeight * elementAspect;
            }
          }
          
          // Size the element
          element.style.width = elementWidth + 'px';
          element.style.height = elementHeight + 'px';
          
          // Position the container
          container.style.left = (parentSize.width - elementWidth) * floatX + "px";
          container.style.top = (parentSize.height - elementHeight) * floatY + "px";
          
        }
        
        // Update the layout when necessary
        window.addEventListener("resize", layout);
        window.addEventListener("updateFloatingContent", layout);
        scope.$watch("floatX", layout);
        scope.$watch("floatY", layout);
        scope.$watch("contentWidth", layout);
        scope.$watch("contentHeight", layout);
        scope.$watch("size", layout);
       
      }
    };
  }
}


module Shared.Controllers {
  
  /**
   * Animations and stuff for <floating-content>
   */
  export class FloatingContentController {
    element: HTMLElement;

    // Load in the element (passed from the linker)
    static $inject = ["$scope"];
		constructor($scope: Shared.FloatingContentScope) {
      this.element = $scope.element;
    }
  
  }
}
