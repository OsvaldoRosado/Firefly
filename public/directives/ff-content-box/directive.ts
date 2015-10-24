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
      scope: true,
      bindToController: {
        content: "=",
        display: "@",
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
    display: FFContentDisplayType;
    expanded: boolean;
  }
}
