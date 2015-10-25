/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared {

  export interface FFContentDisplayAttr {
    content: FFGenericContent;
    expanded: boolean;
    showThumbnail?: boolean;
  }

}

module Shared.Directives {

  export function ffContentBox(): ng.IDirective {
    return {
      restrict: "E",
      scope: true,
      bindToController: {
        content: "=",
        showThumbnail: "=",
        expanded: "="
      },
      controller: Shared.Controllers.FFContentBoxController,
      controllerAs: "cc",
      replace: true,

      templateUrl: "public/directives/ff-content-box/template.html"
    }
  }
}

module Shared.Controllers {

  export class FFContentBoxController {
    content: FFGenericContent;
    showThumbnail: boolean;
    expanded: boolean;
    
    // Watch for the content or element size changing
    static $inject = ["$element"];
		constructor($element: ng.IAugmentedJQuery) {
      
      // If the user specifies a value, our work is done
      if (this.showThumbnail !== undefined) {return;}
      
      // Otherwise the thumbnail depends on the size of the object
      var element : HTMLElement = $element[0];
      this.resize(element.offsetWidth);
      
      $element.on("resize", function(){
        this.resize(element.offsetWidth);
      }.bind(this));
    }
    
    // Resize element
    resize(width: number) {
      this.showThumbnail = (
        this.content.type == FFContentType.Image || 
        this.content.type == FFContentType.Video
      ) && width > 300;
    }
  }
}
