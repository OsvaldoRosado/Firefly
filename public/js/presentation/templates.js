angular.module('presentation').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('public/directives/ff-content/template.html',
    "<div ng-if=cview.isImage><img ng-src={{cview.content.link}} alt=\"{{cview.content.name}}\"></div><div ng-if=cview.isVideo><img ng-if=cview.thumbnail ng-src={{cview.content.thumbnail}} alt=\"{{cview.content.title}}\"><iframe ng-if=!cview.thumbnail src={{cview.content.embed}} frameborder=0></iframe></div>"
  );


  $templateCache.put('public/directives/ff-question/template.html',
    "<div class=ffQuestion ng-class=\"{reply: isReply}\"><h3 ng-bind=content.text></h3><p><span ng-bind=content.upvotes></span> Upvotes</p><cite>- <span ng-bind=content.submitter.name></span></cite></div>"
  );

}]);
