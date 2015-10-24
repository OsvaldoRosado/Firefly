module Shared {

  export interface CollapsedScope extends ng.IScope {
    expanded: string;
    duration: string;
  }

}

module Shared.Directives {

  /**
    <ff-content> intelligently displays raw user submitted content. It changes format based
    on the size of the box, condensing down to an icon if necessary.
  */
  export function collapse(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        expanded: "@",
        duration: "@"
      },
      replace: false,

      // This directive is a dumb wrapper
      transclude: true,
      template: "<ng-transclude></ng-transclude>",

      // The only thing is does is expand or contract
      link: function(scope: Shared.CollapsedScope, jq: ng.IAugmentedJQuery, attrs: Object) {
        var element : HTMLElement = jq[0];

        // Make sure this actually does what it's supposed to do, visually
        element.style.overflow = "hidden";
        element.style.display = "block";

        // Start collapsed if requested
        console.log()
        if (!(scope.expanded == "true")) {
          element.style.height = "0px";
        }

        // Wait for the collapsedness value to change
        scope.$watch("expanded", function(newValue: string, oldValue: string) {
          if (newValue == oldValue) {return;} // This should never happen

          // How big do we want this directive to be?
          var destinationHeight : string = "0px";
          if (newValue == "true") {
            var child : HTMLElement = <HTMLElement>element.children[0]; if (!child) {return;}
            child = <HTMLElement>child.children[0]; if (!child) {return;}
            destinationHeight = (child.getBoundingClientRect().height+"px") || "100%";
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
