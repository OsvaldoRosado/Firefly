var Config = (function () {
    function Config() {
    }
    Config.HOST = "http://" + window.location.host;
    return Config;
})();
// Standardized format for exchanging data between different interfaces and the server.
var FFContentType;
(function (FFContentType) {
    FFContentType[FFContentType["Text"] = 0] = "Text";
    FFContentType[FFContentType["Image"] = 1] = "Image";
    FFContentType[FFContentType["Video"] = 2] = "Video";
    FFContentType[FFContentType["Question"] = 3] = "Question";
    FFContentType[FFContentType["QuestionResponse"] = 4] = "QuestionResponse";
})(FFContentType || (FFContentType = {}));
var Shared;
(function (Shared) {
    var Directives;
    (function (Directives) {
        function collapse() {
            return {
                restrict: "E",
                scope: {
                    expanded: "=",
                    duration: "@"
                },
                replace: false,
                transclude: true,
                template: "<ng-transclude></ng-transclude>",
                link: function (scope, jq, attrs) {
                    var element = jq[0];
                    element.style.overflow = "hidden";
                    element.style.display = "block";
                    if (!scope.expanded) {
                        element.style.height = "0px";
                    }
                    scope.$watch("expanded", function (newValue, oldValue) {
                        if (newValue == oldValue) {
                            return;
                        }
                        var destinationHeight = "0px";
                        if (newValue) {
                            var child = element.children[0];
                            if (!child) {
                                return;
                            }
                            child = child.children[0];
                            if (!child) {
                                return;
                            }
                            destinationHeight = (child.getBoundingClientRect().height + "px") || "100%";
                        }
                        var duration = parseInt(scope.duration) || 200;
                        element.style.transition = "height " + duration + "ms ease-out";
                        setTimeout(function () {
                            element.style.height = destinationHeight;
                            setTimeout(function () {
                                element.style.transition = "";
                            }, 100 + duration);
                        }, 100);
                    });
                }
            };
        }
        Directives.collapse = collapse;
    })(Directives = Shared.Directives || (Shared.Directives = {}));
})(Shared || (Shared = {}));
/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var Shared;
(function (Shared) {
    var Directives;
    (function (Directives) {
        function ffContent() {
            return {
                restrict: "E",
                scope: true,
                bindToController: {
                    content: "=",
                    thumbnail: "="
                },
                controller: Shared.Controllers.FFContentViewController,
                controllerAs: "cview",
                replace: false,
                templateUrl: "public/directives/ff-content/template.html"
            };
        }
        Directives.ffContent = ffContent;
    })(Directives = Shared.Directives || (Shared.Directives = {}));
})(Shared || (Shared = {}));
var Shared;
(function (Shared) {
    var Controllers;
    (function (Controllers) {
        var FFContentViewController = (function () {
            function FFContentViewController($scope) {
                this.thumbnailCutoffWidth = 150;
                this.updateRenderDetails();
                $scope.$watch(function () { return this.content; }, this.updateRenderDetails.bind(this));
            }
            FFContentViewController.prototype.getThumbnail = function () {
                return "http://img.youtube.com/vi/" + this.content.youtubeId + "/0.jpg";
            };
            FFContentViewController.prototype.getEmbedCode = function () {
                return "http://www.youtube.com/embed/" + this.content.youtubeId + "\"";
            };
            FFContentViewController.prototype.updateRenderDetails = function () {
                if (this.content == undefined) {
                    return;
                }
                this.isImage = this.content.type == FFContentType.Image;
                this.isVideo = this.content.type == FFContentType.Video;
                if (this.content.youtubeId !== undefined) {
                    this.renderYouTube(this.content);
                }
            };
            FFContentViewController.prototype.renderYouTube = function (content) {
                content.thumbnail = this.getThumbnail();
                content.embed = this.getEmbedCode();
            };
            FFContentViewController.$inject = ["$scope"];
            return FFContentViewController;
        })();
        Controllers.FFContentViewController = FFContentViewController;
    })(Controllers = Shared.Controllers || (Shared.Controllers = {}));
})(Shared || (Shared = {}));
/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var Shared;
(function (Shared) {
    (function (FFContentDisplayType) {
        FFContentDisplayType[FFContentDisplayType["FFContentThumbnail"] = 0] = "FFContentThumbnail";
        FFContentDisplayType[FFContentDisplayType["FFContentLarge"] = 1] = "FFContentLarge";
    })(Shared.FFContentDisplayType || (Shared.FFContentDisplayType = {}));
    var FFContentDisplayType = Shared.FFContentDisplayType;
})(Shared || (Shared = {}));
var Shared;
(function (Shared) {
    var Directives;
    (function (Directives) {
        function ffContentBox() {
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
            };
        }
        Directives.ffContentBox = ffContentBox;
    })(Directives = Shared.Directives || (Shared.Directives = {}));
})(Shared || (Shared = {}));
var Shared;
(function (Shared) {
    var Controllers;
    (function (Controllers) {
        var FFContentBoxController = (function () {
            function FFContentBoxController() {
            }
            return FFContentBoxController;
        })();
        Controllers.FFContentBoxController = FFContentBoxController;
    })(Controllers = Shared.Controllers || (Shared.Controllers = {}));
})(Shared || (Shared = {}));
/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var Playground;
(function (Playground) {
    var AppController = (function () {
        function AppController($scope) {
            this.expandedIndex = 1;
            this.testUser1 = {
                id: 1,
                name: "Keaton Brandt"
            };
            this.imageContent = {
                type: FFContentType.Image,
                submitter: this.testUser1,
                timestamp: new Date().getTime(),
                upvotes: 3,
                flagged: 0,
                title: "view.png",
                link: "https://goo.gl/jQBTBR"
            };
            this.imageContent2 = {
                type: FFContentType.Image,
                submitter: this.testUser1,
                timestamp: new Date().getTime(),
                upvotes: 0,
                flagged: 0,
                title: "montreal.png",
                text: "Great view from the top of Mont Royal",
                link: "https://goo.gl/VJJujY"
            };
            this.videoContent = {
                type: FFContentType.Video,
                submitter: this.testUser1,
                timestamp: new Date().getTime(),
                upvotes: 0,
                flagged: 0,
                title: "Beach House - On The Sea",
                youtubeId: "0qz0IJXQ720",
                channelTitle: "Sub Pop"
            };
        }
        AppController.prototype.expandItem = function ($scope, index) {
            if (this.expandedIndex == index) {
                this.expandedIndex = -1;
            }
            else {
                this.expandedIndex = index;
            }
        };
        AppController.$inject = ["$scope"];
        return AppController;
    })();
    var app = angular.module("playground", [])
        .controller(Shared.Controllers)
        .controller("AppController", AppController)
        .directive(Shared.Directives)
        .filter("equals", function () {
        return function (value, equals) { return value == equals; };
    })
        .config(["$sceProvider", function ($sceProvider) {
            $sceProvider.enabled(false);
        }]);
})(Playground || (Playground = {}));
