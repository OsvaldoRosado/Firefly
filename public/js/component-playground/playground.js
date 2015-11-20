// Standardized format for exchanging data between different interfaces and the server.
var FFContentType;
(function (FFContentType) {
    FFContentType[FFContentType["Text"] = 0] = "Text";
    FFContentType[FFContentType["Image"] = 1] = "Image";
    FFContentType[FFContentType["Video"] = 2] = "Video";
    FFContentType[FFContentType["Question"] = 3] = "Question";
    FFContentType[FFContentType["QuestionResponse"] = 4] = "QuestionResponse";
})(FFContentType || (FFContentType = {}));
var Config = (function () {
    function Config() {
    }
    Config.HOST = "http://" + window.location.host;
    return Config;
})();
/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../typings/angular/angular.d.ts" />
/// <reference path="../typings/firefly/firefly.d.ts" />
/// <reference path="./config.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shared;
(function (Shared) {
    (function (APIMethod) {
        APIMethod[APIMethod["GET"] = 0] = "GET";
        APIMethod[APIMethod["POST"] = 1] = "POST";
    })(Shared.APIMethod || (Shared.APIMethod = {}));
    var APIMethod = Shared.APIMethod;
    var APIRequest = (function () {
        function APIRequest($http, endpoint, data, method) {
            if (method === void 0) { method = APIMethod.GET; }
            if (endpoint[0] !== "/") {
                endpoint = "/" + endpoint;
            }
            endpoint = Config.HOST + "/api" + endpoint;
            if (method == APIMethod.GET) {
                if (data !== undefined && data !== {}) {
                    endpoint += this.queryFormat(data);
                }
                $http.get(endpoint).then(this.finish.bind(this)).catch(this.fail.bind(this));
            }
            else {
                $http.post(endpoint, data).then(this.finish.bind(this)).catch(this.fail.bind(this));
            }
        }
        APIRequest.prototype.finish = function (response) {
            if (response['status'] !== 200) {
                return this.fail(response);
            }
            this.onsuccess(response['data'], response['headers']);
        };
        APIRequest.prototype.fail = function (error) {
            if (this.onfail !== undefined) {
                this.onfail(error);
            }
            console.log(error);
        };
        APIRequest.prototype.queryFormat = function (data) {
            var s = [];
            for (var i in data) {
                s.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
            }
            return "?" + s.join("&").replace(/%20/g, "+");
        };
        APIRequest.prototype.then = function (f, e) {
            this.onsuccess = f;
            if (e !== undefined) {
                this.onfail = e;
            }
            return this;
        };
        APIRequest.prototype.catch = function (f) { this.onfail = f; return this; };
        return APIRequest;
    })();
    Shared.APIRequest = APIRequest;
    var GetPresentationAPIRequest = (function (_super) {
        __extends(GetPresentationAPIRequest, _super);
        function GetPresentationAPIRequest($http, presentationId) {
            _super.call(this, $http, "/getPresentationFromId/" + presentationId, {});
        }
        return GetPresentationAPIRequest;
    })(Shared.APIRequest);
    Shared.GetPresentationAPIRequest = GetPresentationAPIRequest;
    var GeneratePresentationInstanceAPIRequest = (function (_super) {
        __extends(GeneratePresentationInstanceAPIRequest, _super);
        function GeneratePresentationInstanceAPIRequest($http, presentationId) {
            _super.call(this, $http, "/generatePresentationInstance/" + presentationId, {});
        }
        return GeneratePresentationInstanceAPIRequest;
    })(Shared.APIRequest);
    Shared.GeneratePresentationInstanceAPIRequest = GeneratePresentationInstanceAPIRequest;
    var PostPresentationStateAPIRequest = (function (_super) {
        __extends(PostPresentationStateAPIRequest, _super);
        function PostPresentationStateAPIRequest($http, instanceId, curslide, curContentId) {
            var reqbody = {
                instanceid: instanceId,
                curslide: curslide,
                curcontentid: undefined
            };
            if (curContentId != undefined) {
                reqbody.curcontentid = curContentId;
            }
            _super.call(this, $http, "/postCurrentState", reqbody, APIMethod.POST);
        }
        return PostPresentationStateAPIRequest;
    })(Shared.APIRequest);
    Shared.PostPresentationStateAPIRequest = PostPresentationStateAPIRequest;
    var GetPresentationStateAPIRequest = (function (_super) {
        __extends(GetPresentationStateAPIRequest, _super);
        function GetPresentationStateAPIRequest($http, instanceId) {
            _super.call(this, $http, "/getCurrentState/" + instanceId, {});
        }
        return GetPresentationStateAPIRequest;
    })(Shared.APIRequest);
    Shared.GetPresentationStateAPIRequest = GetPresentationStateAPIRequest;
    var GenerateShortInstanceURLAPIRequest = (function (_super) {
        __extends(GenerateShortInstanceURLAPIRequest, _super);
        function GenerateShortInstanceURLAPIRequest($http, instanceId) {
            _super.call(this, $http, "/GenerateShortInstanceURL/" + instanceId, {});
        }
        return GenerateShortInstanceURLAPIRequest;
    })(Shared.APIRequest);
    Shared.GenerateShortInstanceURLAPIRequest = GenerateShortInstanceURLAPIRequest;
    var PostContentForPresentationInstance = (function (_super) {
        __extends(PostContentForPresentationInstance, _super);
        function PostContentForPresentationInstance($http, instanceId, content) {
            var reqbody = {
                instanceid: instanceId,
                data: JSON.stringify(content)
            };
            _super.call(this, $http, "/postContentForPresentationInstance", reqbody, APIMethod.POST);
        }
        return PostContentForPresentationInstance;
    })(Shared.APIRequest);
    Shared.PostContentForPresentationInstance = PostContentForPresentationInstance;
    var GetContentForPresentationInstance = (function (_super) {
        __extends(GetContentForPresentationInstance, _super);
        function GetContentForPresentationInstance($http, instanceId) {
            _super.call(this, $http, "/getContentForPresentationInstance/" + instanceId, {});
        }
        return GetContentForPresentationInstance;
    })(Shared.APIRequest);
    Shared.GetContentForPresentationInstance = GetContentForPresentationInstance;
})(Shared || (Shared = {}));
var Shared;
(function (Shared) {
    var LocalWindow = (function () {
        function LocalWindow(wnd) {
            this.theWindow = wnd;
        }
        LocalWindow.prototype.postMessage = function (data) {
            this.theWindow.postMessage(data, Config.HOST);
        };
        LocalWindow.prototype.command = function (action, data) {
            this.postMessage(JSON.stringify({ action: action, data: data }));
        };
        LocalWindow.prototype.close = function () {
            this.theWindow.close();
        };
        return LocalWindow;
    })();
    Shared.LocalWindow = LocalWindow;
    var LocalWindowManager = (function () {
        function LocalWindowManager(theWindows) {
            this.windows = theWindows.map(function (wnd) { return new LocalWindow(wnd); });
        }
        LocalWindowManager.prototype.postAll = function (data) {
            this.windows.forEach(function (wnd) { return wnd.postMessage(data); });
        };
        LocalWindowManager.prototype.commandAll = function (action, data) {
            this.windows.forEach(function (wnd) { return wnd.command(action, data); });
        };
        LocalWindowManager.prototype.commandOne = function (id, action, data) {
            this.windows[id].command(action, data);
        };
        LocalWindowManager.prototype.closeAll = function () {
            this.windows.forEach(function (wnd) { return wnd.close(); });
        };
        return LocalWindowManager;
    })();
    Shared.LocalWindowManager = LocalWindowManager;
})(Shared || (Shared = {}));
/// <reference path="../../js/typings/angular/angular.d.ts" />
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
                    var transclude = element.querySelector("ng-transclude");
                    transclude.style.display = "block";
                    var getInnerHeight = function () {
                        var lastChild = transclude.children[transclude.children.length - 1];
                        var marginBottom = 0;
                        if (lastChild) {
                            marginBottom = parseInt(window.getComputedStyle(lastChild).marginBottom);
                        }
                        return transclude.getBoundingClientRect().height + marginBottom;
                    };
                    element.style.overflow = "hidden";
                    element.style.display = "block";
                    var lastHeight = 0;
                    if (scope.expanded) {
                        lastHeight = getInnerHeight();
                    }
                    element.style.height = lastHeight + "px";
                    scope.$watch("expanded", function (newValue, oldValue) {
                        if (newValue == oldValue) {
                            return;
                        }
                        element.setAttribute("is-expanded", newValue.toString());
                        var destinationHeight = "0px";
                        if (newValue) {
                            destinationHeight = (getInnerHeight() + "px") || "100%";
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
                    var heightWatch = setInterval(function () {
                        var newHeight = getInnerHeight();
                        if (newHeight != lastHeight) {
                            lastHeight = newHeight;
                            if (scope.expanded) {
                                element.style.height = lastHeight + "px";
                            }
                        }
                    }, 100);
                    scope.$on("$destroy", function () {
                        clearInterval(heightWatch);
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
                return "http://www.youtube.com/embed/" + this.content.youtubeId;
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
/// <reference path="../../js/shared/api.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var Shared;
(function (Shared) {
    var UpvoteAPIRequest = (function (_super) {
        __extends(UpvoteAPIRequest, _super);
        function UpvoteAPIRequest($http, contentId) {
            _super.call(this, $http, "/UpvotePresContent", { id: contentId }, Shared.APIMethod.GET);
        }
        return UpvoteAPIRequest;
    })(Shared.APIRequest);
    Shared.UpvoteAPIRequest = UpvoteAPIRequest;
    var FlagAPIRequest = (function (_super) {
        __extends(FlagAPIRequest, _super);
        function FlagAPIRequest($http, contentId) {
            _super.call(this, $http, "/FlagPresContent", { id: contentId }, Shared.APIMethod.GET);
        }
        return FlagAPIRequest;
    })(Shared.APIRequest);
    Shared.FlagAPIRequest = FlagAPIRequest;
})(Shared || (Shared = {}));
/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
/// <reference path="./api.ts" />
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
                    showThumbnail: "=",
                    expanded: "=",
                    onToggle: "&"
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
            function FFContentBoxController($scope, $element, $http) {
                this.scope = $scope;
                this.http = $http;
                this.isFlagged = false;
                this.isQuestion = (this.content.type == FFContentType.Question);
                if (this.showThumbnail !== undefined) {
                    return;
                }
                var element = $element[0];
                this.resize(element.offsetWidth);
                $element.on("resize", function () {
                    this.resize(element.offsetWidth);
                }.bind(this));
            }
            FFContentBoxController.prototype.resize = function (width) {
                this.showThumbnail = (this.content.type == FFContentType.Image ||
                    this.content.type == FFContentType.Video) && width > 300;
            };
            FFContentBoxController.prototype.upvoteContent = function () {
                var _this = this;
                this.content.upvotes += 1;
                new Shared.UpvoteAPIRequest(this.http, this.content.id).catch(function () {
                    _this.content.upvotes -= 1;
                });
            };
            FFContentBoxController.prototype.flagContent = function () {
                var _this = this;
                new Shared.FlagAPIRequest(this.http, this.content.id).catch(function () {
                    alert("ERROR: Could not flag content. It may already be deleted");
                }).then(function () {
                    _this.isFlagged = true;
                });
            };
            FFContentBoxController.prototype.shareContent = function () {
                var link = "";
                if (this.content.youtubeId !== undefined) {
                    link = "https://www.youtube.com/watch?v=" + this.content.youtubeId;
                }
                else if (this.content.link !== undefined) {
                    link = this.content.link;
                }
                else if (this.content.text !== undefined) {
                    var w = window.open("", "_blank");
                    w.document.write(this.content.text);
                    return;
                }
                window.open(link, "_blank");
            };
            FFContentBoxController.$inject = ["$scope", "$element", "$http"];
            return FFContentBoxController;
        })();
        Controllers.FFContentBoxController = FFContentBoxController;
    })(Controllers = Shared.Controllers || (Shared.Controllers = {}));
})(Shared || (Shared = {}));
/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var Shared;
(function (Shared) {
    var Directives;
    (function (Directives) {
        function ffQuestion() {
            return {
                restrict: "E",
                scope: {
                    content: "=",
                    isReply: "="
                },
                replace: true,
                templateUrl: "public/directives/ff-question/template.html"
            };
        }
        Directives.ffQuestion = ffQuestion;
    })(Directives = Shared.Directives || (Shared.Directives = {}));
})(Shared || (Shared = {}));
/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var Playground;
(function (Playground) {
    var AppController = (function () {
        function AppController($scope) {
            this.expandedIndex = 1;
            this.testUser1 = {
                id: "1",
                name: "Keaton Brandt"
            };
            this.imageContent = {
                id: "1",
                presentationId: "1",
                type: FFContentType.Image,
                submitter: this.testUser1,
                timestamp: new Date().getTime(),
                upvotes: 3,
                flagged: 0,
                filename: "view.png",
                link: "/images/dummy/view.jpg"
            };
            this.imageContent2 = {
                id: "2",
                presentationId: "1",
                type: FFContentType.Image,
                submitter: this.testUser1,
                timestamp: new Date().getTime(),
                upvotes: 0,
                flagged: 0,
                filename: "montreal.png",
                text: "Great view from the top of Mont Royal",
                link: "/images/dummy/montreal.jpg"
            };
            this.videoContent = {
                id: "3",
                presentationId: "1",
                type: FFContentType.Video,
                submitter: this.testUser1,
                timestamp: new Date().getTime(),
                upvotes: 0,
                flagged: 0,
                title: "Beach House - On The Sea",
                youtubeId: "0qz0IJXQ720",
                channelTitle: "Sub Pop"
            };
            this.questionContent = {
                id: "4",
                presentationId: "1",
                type: FFContentType.Question,
                submitter: this.testUser1,
                timestamp: new Date().getTime(),
                upvotes: 0,
                flagged: 0,
                text: "Is there any reason at all to use Model-View-Controller\n\t\t\t\t\tinstead of Model-View-ViewModel or whatever other sensible\n\t\t\t\t\talternative?\n\t\t\t\t",
                replies: [
                    {
                        id: "5",
                        presentationId: "1",
                        type: FFContentType.QuestionResponse,
                        submitter: this.testUser1,
                        timestamp: new Date().getTime(),
                        upvotes: 0,
                        flagged: 0,
                        text: "No. Why would the model directly update the view?\n\t\t\t\t\t\t\tThat makes no sense.\n\t\t\t\t\t\t"
                    },
                    {
                        id: "6",
                        presentationId: "1",
                        type: FFContentType.QuestionResponse,
                        submitter: this.testUser1,
                        timestamp: new Date().getTime(),
                        upvotes: 0,
                        flagged: 0,
                        text: "I mean, seriously, it doesn't reduce glue code it\n\t\t\t\t\t\t\tjust makes sure every component has the same amount of glue.\n\t\t\t\t\t\t"
                    }
                ]
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
