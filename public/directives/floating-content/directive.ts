/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared.Directives {

  /**
    <floating-content> uses absolute positioning to fit content within its parent.
    It has a few different animations to spice things up.
    
    @attribute floatX: Horizontal positioning of content, as a percent or decimal
    @attribute floatY: Vertical positioning of content, as a percent or decimal
    @attribute contentWidth: Pixel width of original content (may be scaled)
    @attribute contentHeight: Pixel height of original content (may be scaled)
    @attribute size: When present, content is scaled to fit in the container.
      Value is a decimal that specifies what fraction of the max size to be.
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

      // The only thing is does is expand or contract
      link: function(scope: ng.IScope, jq: ng.IAugmentedJQuery, attrs: Object) {
        var container : HTMLElement = scope['container'] = jq[0];
        var transclude = container.children[0]; if (!transclude) {return;}
        var element = transclude.children[0]; if (!element) {return;}
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
          
          // Size its container
          transclude.style.width = elementWidth + 'px';
          transclude.style.height = elementHeight + 'px';
          
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