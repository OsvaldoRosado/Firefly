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
/// <reference path="../../js/typings/angular/angular.d.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var Shared;
(function (Shared) {
    var Directives;
    (function (Directives) {
        function floatingContent() {
            return {
                restrict: "E",
                scope: {
                    floatX: "@",
                    floatY: "@",
                    contentWidth: "@",
                    contentHeight: "@",
                    size: "@"
                },
                replace: false,
                transclude: true,
                template: "<ng-transclude></ng-transclude>",
                link: function (scope, jq, attrs) {
                    var container = scope['container'] = jq[0];
                    var element = container.children[0];
                    if (!element) {
                        return;
                    }
                    element = element.children[0];
                    if (!element) {
                        return;
                    }
                    scope['element'] = element;
                    var parent = container.parentElement;
                    if (!parent) {
                        return;
                    }
                    function layout() {
                        var floatX = parseFloat(scope['floatX']);
                        if (floatX > 1) {
                            floatX /= 100;
                        }
                        var floatY = parseFloat(scope['floatY']);
                        if (floatY > 1) {
                            floatY /= 100;
                        }
                        var elementWidth = parseInt(scope['contentWidth']);
                        var elementHeight = parseInt(scope['contentHeight']);
                        var parentSize = parent.getBoundingClientRect();
                        if (scope['size']) {
                            var scale = parseFloat(scope['size']);
                            var elementAspect = elementWidth / elementHeight;
                            var parentAspect = parentSize.width / parentSize.height;
                            if (elementAspect > parentAspect) {
                                elementWidth = parentSize.width * scale;
                                elementHeight = elementWidth / elementAspect;
                            }
                            else {
                                elementHeight = parentSize.height * scale;
                                elementWidth = elementHeight * elementAspect;
                            }
                        }
                        element.style.width = elementWidth + 'px';
                        element.style.height = elementHeight + 'px';
                        container.style.left = (parentSize.width - elementWidth) * floatX + "px";
                        container.style.top = (parentSize.height - elementHeight) * floatY + "px";
                    }
                    window.addEventListener("resize", layout);
                    window.addEventListener("updateFloatingContent", layout);
                    scope.$watch("floatX", layout);
                    scope.$watch("floatY", layout);
                    scope.$watch("contentWidth", layout);
                    scope.$watch("contentHeight", layout);
                    scope.$watch("size", layout);
                }
            };
        }
        Directives.floatingContent = floatingContent;
    })(Directives = Shared.Directives || (Shared.Directives = {}));
})(Shared || (Shared = {}));
/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
var PresentationApp;
(function (PresentationApp) {
    var Controllers;
    (function (Controllers) {
        var ViewableCtrl = (function () {
            function ViewableCtrl($scope) {
                var _this = this;
                this.scope = $scope;
                this.slides = [];
                this.isLoading = false;
                window.addEventListener("message", function (event) {
                    if (event.origin !== Config.HOST) {
                        return;
                    }
                    var order = JSON.parse(event.data);
                    switch (order.action) {
                        case "changeSlide":
                            _this.changeSlide(order.data);
                            break;
                        case "showOverlay":
                            _this.overlayUrl = order.data;
                            _this.qaActive = _this.overlayIsVideo = false;
                            _this.overlayActive = true;
                            break;
                        case "showOverlayVideo":
                            _this.overlayUrl = order.data;
                            _this.qaActive = false;
                            _this.overlayActive = _this.overlayIsVideo = true;
                            break;
                        case "hideOverlay":
                            _this.overlayUrl = undefined;
                            _this.overlayActive = _this.overlayIsVideo = false;
                            break;
                        case "showQASidebar":
                            _this.question = JSON.parse(order.data);
                            _this.overlayActive = false;
                            _this.qaActive = true;
                            break;
                        case "hideQASidebar":
                            _this.question = undefined;
                            _this.qaActive = false;
                            break;
                        case "showAccessLink":
                            _this.accessLink = order.data;
                            setTimeout(function () {
                                window.dispatchEvent(new Event("updateFloatingContent"));
                            }, 10);
                            break;
                    }
                    $scope.$apply();
                });
            }
            ViewableCtrl.prototype.changeSlide = function (url, forwards) {
                var _this = this;
                if (forwards === void 0) { forwards = true; }
                var slideImage = new Image;
                slideImage.addEventListener("load", function () {
                    _this.scope.$apply(function () {
                        _this.isLoading = false;
                        _this.slides.push({
                            url: url,
                            width: slideImage.width,
                            height: slideImage.height
                        });
                    });
                });
                this.isLoading = true;
                slideImage.src = url;
            };
            ViewableCtrl.prototype.showOverlay = function (url, isVideo) {
            };
            ViewableCtrl.$inject = ["$scope"];
            return ViewableCtrl;
        })();
        Controllers.ViewableCtrl = ViewableCtrl;
    })(Controllers = PresentationApp.Controllers || (PresentationApp.Controllers = {}));
})(PresentationApp || (PresentationApp = {}));
var PresentationApp;
(function (PresentationApp) {
    var AppController = (function () {
        function AppController() {
            this.dummyMode = (window.location.hash === "#dummy");
            if (this.dummyMode) {
                console.log("Dummy mode enabled. Interact on window.dummy");
                window['dummy'] = this;
                var command = {
                    action: "changeSlide",
                    data: "./images/dummy/slide.png"
                };
                window.postMessage(JSON.stringify(command), Config.HOST);
            }
        }
        AppController.prototype.showAccessLink = function () {
            var command = {
                action: "showAccessLink",
                data: "onfirefly.ws"
            };
            window.postMessage(JSON.stringify(command), Config.HOST);
        };
        AppController.prototype.advanceSlide = function () {
            var command = {
                action: "changeSlide",
                data: "./images/dummy/slide2.png"
            };
            window.postMessage(JSON.stringify(command), Config.HOST);
        };
        AppController.prototype.imageOverlay = function () {
            var command = {
                action: "showOverlay",
                data: "./images/dummy/view.jpg"
            };
            window.postMessage(JSON.stringify(command), Config.HOST);
        };
        AppController.prototype.clearOverlay = function () {
            window.postMessage(JSON.stringify({ action: "hideOverlay" }), Config.HOST);
        };
        return AppController;
    })();
    angular.module("presentation", ["ngAnimate"])
        .controller(Shared.Controllers)
        .controller(PresentationApp.Controllers)
        .controller("AppController", AppController)
        .directive(Shared.Directives)
        .config(["$sceProvider", function ($sceProvider) {
            $sceProvider.enabled(false);
        }]);
})(PresentationApp || (PresentationApp = {}));
;
