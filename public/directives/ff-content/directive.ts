/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared.Directives {

  /**
    <ff-content> intelligently displays raw user submitted content. It changes format based
    on the size of the box, condensing down to an icon if necessary.
  */
  export function ffContent(): ng.IDirective {
    return {
      restrict: "E",
      scope: true,
      bindToController: {
        content: "="
      },
      controller: Shared.Controllers.FFContentViewController,
      controllerAs: "cview",
      replace: false,

      templateUrl: "public/directives/ff-content/template.html"
    }
  }
}

module Shared.Controllers {

  export class FFContentViewController {
    content: FFGenericContent;
    isImage: boolean;
    isFrame: boolean;
    reducesToIcon: boolean;

    static $inject = ["$scope"];
		constructor($scope: ng.IScope) {
      this.updateRenderDetails()
      
      // This line here makes me very sad as a person
      $scope.$watch(function(){return this.content;}, this.updateRenderDetails.bind(this));
    }
    
    updateRenderDetails() {
      if (this.content == undefined) {return;}
      this.isImage = (this.content.type == FFContentType.Image);
      this.isFrame = (this.content.type == FFContentType.Video);
      this.reducesToIcon = !this.isImage && !this.isFrame;
    }
  }
}
