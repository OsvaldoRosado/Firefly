angular.module('playground').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('public/directives/ff-content/template.html',
    "<div ng-if=cview.isImage><img ng-src={{cview.content.link}} alt=\"{{cview.content.name}}\"></div>"
  );


  $templateCache.put('public/directives/ff-content-box/template.html',
    "<ff-content class=full content=cc.content></ff-content><div class=desc><ff-content class=thumb content=cc.content></ff-content><div class=meta><h2 ng-bind=cc.content.title></h2><h3 ng-bind=cc.content.text ng-if=cc.content.text></h3><div class=bottomrow><cite ng-bind=cc.content.submitter.name></cite><p class=upvotes ng-bind=cc.content.upvotes></p></div></div></div>"
  );

}]);
