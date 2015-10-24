angular.module('playground').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('public/directives/ff-content/template.html',
    "<div ng-if=cview.isImage><img ng-src={{cview.content.link}} alt=\"{{cview.content.name}}\"></div>"
  );


  $templateCache.put('public/directives/ff-content-box/template.html',
    "<div class=ffContentBox ng-class=\"{expanded: cc.expanded}\"><collapse expanded=cc.expanded><ff-content content=cc.content class=full></ff-content></collapse><div class=desc><ff-content class=thumb content=cc.content></ff-content><div class=meta><h3 ng-bind=cc.content.text ng-if=cc.content.text></h3><div class=bottomrow><p ng-bind=cc.content.title></p><cite ng-bind=cc.content.submitter.name></cite></div></div></div><collapse expanded=cc.expanded><div class=commands><div class=action><img src=/public/images/Actions-ThumbsUp.svg alt=Upvote><p><b ng-bind=cc.content.upvotes></b> Upvotes</p></div><div class=action><img src=/public/images/Actions-Flag.svg alt=Flag><p>Flag Content</p></div><div class=action><img src=/public/images/Actions-Share.svg alt=Share><p>Share</p></div></div></collapse></div>"
  );

}]);
