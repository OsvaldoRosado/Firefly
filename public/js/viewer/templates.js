angular.module('viewer').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('public/directives/ff-content/template.html',
    "<div ng-if=cview.isImage><img ng-src={{cview.content.link}} alt=\"{{cview.content.name}}\"></div><div ng-if=cview.isVideo><img ng-if=cview.thumbnail ng-src={{cview.content.thumbnail}} alt=\"{{cview.content.title}}\"><iframe ng-if=!cview.thumbnail src={{cview.content.embed}} frameborder=0></iframe></div>"
  );


  $templateCache.put('public/directives/ff-content-box/template.html',
    "<div class=ffContentBox ng-class=\"{expanded: cc.expanded, isQuestion: cc.isQuestion}\"><collapse expanded=cc.expanded><ff-content content=cc.content class=full thumbnail=false></ff-content></collapse><div class=desc ng-class=\"{nothumb: !cc.showThumbnail}\" ng-click=cc.onToggle()><ff-content ng-if=cc.showThumbnail class=thumb content=cc.content thumbnail=true></ff-content><div class=meta><h3 ng-bind=cc.content.text ng-if=cc.content.text></h3><h3 ng-bind=cc.content.filename ng-if=\"cc.content.filename && !cc.content.text\"></h3><h3 ng-bind=cc.content.title ng-if=cc.content.title></h3><h5 ng-if=cc.content.channelTitle>Posted by <span ng-bind=cc.content.channelTitle></span></h5><div class=bottomrow><p ng-bind=cc.content.filename class=filename ng-if=\"cc.content.filename && cc.content.text\"></p><p ng-if=cc.content.replies><span ng-bind=cc.content.replies.length></span> <span ng-bind=\"cc.content.replies.length > 1 ? ' Replies': ' Reply'\"></span></p><cite>- <span ng-bind=cc.content.submitter.name></span></cite></div></div><collapse expanded=cc.expanded ng-if=cc.isQuestion class=replies><ff-question ng-repeat=\"reply in cc.content.replies\" content=reply is-reply=true></ff-question></collapse></div><collapse expanded=cc.expanded><div class=commands><div class=action ng-click=cc.upvoteContent()><img src=/images/Actions-ThumbsUp.svg alt=Upvote><p><b ng-bind=cc.content.upvotes></b> Upvotes</p></div><div class=action ng-click=cc.flagContent()><img src=/images/Actions-Flag.svg alt=Flag><p>Flag Content</p></div><div class=action ng-hide=cc.isQuestion><img src=/images/Actions-Share.svg alt=Share><p>Share</p></div></div></collapse></div>"
  );


  $templateCache.put('public/directives/ff-question/template.html',
    "<div class=ffQuestion ng-class=\"{reply: isReply}\"><h3 ng-bind=content.text></h3><p><span ng-bind=content.upvotes></span> Upvotes</p><cite>- <span ng-bind=content.submitter.name></span></cite></div>"
  );


  $templateCache.put('public/templates/viewer/ask.html',
    "<div class=mainContent><div class=askSection><div class=editor ng-class=\"{invalid: !qc.questionValid}\"><textarea placeholder=\"Ask a question\" ng-model=qc.questionText></textarea></div><button class=u-full-width ng-click=qc.askQuestion()>ASK</button></div><div class=\"pastSubmissions row\"><h4>Recently Asked</h4><ff-content-box ng-repeat=\"question in app.content | filter:{type:3}\" display=0 content=question expanded=\"qc.expandedIndex | equals:$index\" on-toggle=qc.expandItem($index)></ff-content-box></div></div>"
  );


  $templateCache.put('public/templates/viewer/history.html',
    "<div class=\"mainContent container\"><div class=history><div class=\"currentClass row\"><h2>Art History 1010</h2><a href=#>Other Classes</a></div><ul class=row><li><a href=#><div class=historyItem><div class=\"historyTitle live\"><h2>Beginnings of Cubism</h2><p>November 4th, 2015</p></div><div class=historyPulse><div class=darkPulse></div></div></div></a></li><li><a href=#><div class=historyItem><div class=historyTitle><h2>Advaanced Expressionism</h2><p>October 30th, 2015</p></div></div></a></li><li><a href=#><div class=historyItem><div class=\"historyTitle live\"><h2>The Spark of Expressionism</h2><p>October 23rd, 2015</p></div><div class=historyPulse><div class=darkPulse></div></div></div></a></li><li><a href=#><div class=historyItem><div class=historyTitle><h2>Post-Expressionism</h2><p>October 18th, 2015</p></div></div></a></li><li><a href=#><div class=historyItem><div class=historyTitle><h2>My 'Impressions' of Monet</h2><p>October 12th, 2015</p></div></div></a></li><li><a href=#><div class=\"historyItem live\"><div class=historyTitle><h2>The Original Renaissance Mannn</h2><p>October 5th, 2015</p></div><div class=historyPulse><div class=darkPulse></div></div></div></a></li></ul></div></div>"
  );


  $templateCache.put('public/templates/viewer/live.html',
    "<div class=mainContent><div class=\"currentSlideViewer row\"><iframe src=presentation.html id=presPreview scrolling=no></iframe></div><div class=\"pastSubmissions row\"><h4>User Submissions</h4></div></div>"
  );


  $templateCache.put('public/templates/viewer/nothing.html',
    "<div class=\"mainContent nothing\"><h3>Sorry</h3><h4>Submitting content is not yet supported</h4></div>"
  );


  $templateCache.put('public/templates/viewer/submit.html',
    "<div class=\"mainContent submitPage\"><div class=submitContent><ul class=row><li><a href=#/submit/link><i class=submitContentIcon><img src=\"images/dummy/clipboard.png\"></i><div class=submitContentItem><div class=submitContentItemText><h2>Paste Link</h2><p>Copy a link to a website, image or YouTube video and paste it here to share.</p></div></div><i class=arrow>&rsaquo;</i></a></li><li><a href=#/notsupported><i class=\"submitContentIcon upload\"><img src=\"images/dummy/upload.png\"></i><div class=submitContentItem><div class=submitContentItemText><h2>Upload Image</h2><p>Choose a photo from your phone’s camera roll to upload.</p></div></div><i class=arrow>&rsaquo;</i></a></li><li><a href=#/notsupported><i class=submitContentIcon><img src=\"images/dummy/browser.png\"></i><div class=submitContentItem><div class=submitContentItemText><h2>Browse the Web</h2><p>Use our in-app browser to find the web link or YouTube video you’re looking for.</p></div></div><i class=arrow>&rsaquo;</i></a></li></ul></div></div>"
  );


  $templateCache.put('public/templates/viewer/submitlink.html',
    "<div class=\"mainContent submitlink\"><label for=link_url>Paste a URL here</label><input name=link_url ng-model=link.link ng-model-options={debounce:1000} ng-change=\"link.changed()\"><label for=link_url ng-bind=\"link.preview.title || 'Preview'\"></label><ff-content class=preview ng-class=\"{loading: link.loading, loaded: link.loaded}\" content=link.preview thumbnail=false></ff-content><div ng-show=link.loaded><textarea placeholder=\"Add a note (optional)\" id=link_note ng-model=link.preview.text>\r" +
    "\n" +
    "    </textarea><div class=buttonrow><button type=button class=secondary ng-click=link.cancel()>CANCEL</button> <button type=button class=primary ng-click=link.post()>POST</button></div></div></div>"
  );

}]);
