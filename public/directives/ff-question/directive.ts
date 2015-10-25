/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared.Directives {

  /**
   * <ff-content> intelligently displays raw user submitted content. It changes format based
   * on the size of the box, condensing down to an icon if necessary.
   */
  export function ffQuestion(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
        content: "=",
        isReply: "="
      },
      replace: true,
      templateUrl: "public/directives/ff-question/template.html"
    }
  }
}