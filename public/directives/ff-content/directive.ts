module Shared.Directives {

  /**
    <ff-content> intelligently displays raw user submitted content. It changes format based
    on the size of the box, condensing down to an icon if necessary.
  */
  export function ffContent(): ng.IDirective {
    return {
      restrict: "E",
      scope: {
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

    static $inject = [
      "$scope"
    ];
    constructor($scope: Object) {
      this.content = $scope['content'];

      this.isImage = ($scope['content'].type == FFContentType.Image);
      this.isFrame = ($scope['content'].type == FFContentType.Video);
      this.reducesToIcon = !this.isImage && !this.isFrame;
    }
  }
}
