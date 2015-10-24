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
                    expanded: "@",
                    duration: "@"
                },
                replace: false,
                transclude: true,
                template: "<ng-transclude></ng-transclude>",
                link: function (scope, jq, attrs) {
                    var element = jq[0];
                    element.style.overflow = "hidden";
                    element.style.display = "block";
                    console.log();
                    if (!(scope.expanded == "true")) {
                        element.style.height = "0px";
                    }
                    scope.$watch("expanded", function (newValue, oldValue) {
                        if (newValue == oldValue) {
                            return;
                        }
                        var destinationHeight = "0px";
                        if (newValue == "true") {
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
var Shared;
(function (Shared) {
    var Directives;
    (function (Directives) {
        function ffContent() {
            return {
                restrict: "E",
                scope: {
                    content: "="
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
                this.content = $scope['content'];
                this.isImage = ($scope['content'].type == FFContentType.Image);
                this.isFrame = ($scope['content'].type == FFContentType.Video);
                this.reducesToIcon = !this.isImage && !this.isFrame;
            }
            FFContentViewController.$inject = [
                "$scope"
            ];
            return FFContentViewController;
        })();
        Controllers.FFContentViewController = FFContentViewController;
    })(Controllers = Shared.Controllers || (Shared.Controllers = {}));
})(Shared || (Shared = {}));
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
                scope: {
                    content: "=",
                    display: "@",
                    expanded: "@"
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
            function FFContentBoxController($scope) {
                console.log($scope);
                this.content = $scope.content;
                this.display = $scope.display;
                this.expanded = $scope.expanded || false;
            }
            FFContentBoxController.prototype.toggleExpansion = function () {
                this.expanded = !this.expanded;
            };
            FFContentBoxController.$inject = [
                "$scope"
            ];
            return FFContentBoxController;
        })();
        Controllers.FFContentBoxController = FFContentBoxController;
    })(Controllers = Shared.Controllers || (Shared.Controllers = {}));
})(Shared || (Shared = {}));
var Playground;
(function (Playground) {
    var AppController = (function () {
        function AppController() {
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
                link: "https://lh3.googleusercontent.com/Ta9OV6qh8vAUcPWPat5M2e6IgXjVDbVUdMX1qXxTPWNJyPybi339G8nFjnlO1c4FaafgtZEP0guYSbu9IG3du3TQBgo6hofue34C4BXZ_v0Rg51a9FOguC9juA7YBaLAoltsOuXRK4SvGk14ukg2ISyvBxH3xE69GgelAmeLXX3jIyDxaBmDT4cV5r73w1F-MOXF1o1gPUN8rQMcrkQ0AH4NJPmYR8ERyyfq7SrQMjlzfFFyxuh4eji86ijHK8rN87gyyF-HwTxoT0xahYDK_kLtFNTJJTz7VE7w6Zb_pA9TCX1Or0hrQsnPwUdnsArv081F04bmjrSwipKccvRjqfMaQXl970g100GuGLiq7n7GV2lgJy6jjpPfdb2_M5BaSJGiFHf33gEWI7W22KdySSQE5aWfwuDYVSj8Dg6OXj3fqASqTeb1KOBzAguDVwGkApDzhv42s4AY_ypkq6vV9RRmf-YLIUoNWScHUnqoMzDaPC07Mz86L3k0V_D6rv3JCyZRk4Cp8ss8BSKFVBSWa5pAzgVaLz9t-tbJRyVaawoy=w794-h590-no"
            };
        }
        return AppController;
    })();
    var app = angular.module("playground", [])
        .controller(Shared.Controllers)
        .controller("AppController", AppController)
        .directive(Shared.Directives);
})(Playground || (Playground = {}));
