/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
/// <reference path="./api.ts" />

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
        expanded: "=",
        onToggle: "&"
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
    scope: ng.IScope;
    http: ng.IHttpService;
    
    // Bound from scope
    content: FFGenericContent;
    showThumbnail: boolean;
    expanded: boolean;
    onToggle: Function;
    
    // Template rendering settings
    isQuestion: boolean;
    
    
    // Watch for the content or element size changing
    static $inject = ["$scope", "$element", "$http"];
		constructor($scope: ng.IScope, $element: ng.IAugmentedJQuery, $http: ng.IHttpService) {
      this.scope = $scope;
      this.http = $http;
      
      // Analyze the content for ideal display
      this.isQuestion = (this.content.type == FFContentType.Question);
      
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
    
    // Upvote handler
    upvoteContent() {
      this.content.upvotes += 1;
      new UpvoteAPIRequest(this.http, this.content.id).catch(()=> {
        this.content.upvotes -= 1;
      });
    }
  }
}
