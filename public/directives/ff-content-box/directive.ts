/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared {

  export enum FFContentDisplayType {
    FFContentThumbnail = 0,
    FFContentLarge = 1
  }

  export interface FFContentDisplayAttr {
    content: FFGenericContent;
    display: FFContentDisplayType;
    expanded: boolean;
  }

}

module Shared.Directives {

  export function ffContentBox(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        content: "=",
        display: "@",
        expanded: "@"
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
    display: FFContentDisplayType;
    expanded: boolean;

    static $inject = [
      "$scope"
    ];
    constructor($scope: FFContentDisplayAttr) {
      console.log($scope);
      this.content = $scope.content;
      this.display = $scope.display;
      this.expanded = $scope.expanded || false;
    }

    toggleExpansion() {
      this.expanded = !this.expanded;
    }
  }
}
