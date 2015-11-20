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
                this.content.upvotes = 1;
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
/// <reference path="../shared/api.ts" />
/// <reference path="../shared/localWindow.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />
var ViewerApp;
(function (ViewerApp) {
    var AppController = (function () {
        function AppController($rootScope, $scope, $http) {
            var _this = this;
            this.scope = $scope;
            this.http = $http;
            this.content = [];
            var params = window.location.search;
            var id = this.instanceID = params.split("&")[0].split("=")[1];
            new Shared.GetPresentationStateAPIRequest($http, id).then(function (data, headers) {
                _this.presentationInstance = data.data;
                new Shared.GetPresentationAPIRequest($http, _this.presentationInstance.presentationId).then(function (data, headers) {
                    _this.presentation = data.data;
                    window.dispatchEvent(new Event("ffPresentationLoaded"));
                });
                _this.loadSubmittedContent();
            });
            this.pageName = "/";
            $rootScope.$on('$routeChangeSuccess', function (e, newVal) {
                _this.pageName = newVal.$$route.originalPath;
            });
        }
        AppController.prototype.loadSubmittedContent = function () {
            var _this = this;
            new Shared.GetContentForPresentationInstance(this.http, this.presentationInstance.id).then(function (data) {
                _this.content = data.data;
            });
        };
        AppController.$inject = ["$rootScope", "$scope", "$http"];
        return AppController;
    })();
    ViewerApp.AppController = AppController;
    var app = angular.module("viewer", ["ngRoute"])
        .controller(Shared.Controllers)
        .controller(ViewerApp.Controllers)
        .controller("AppController", AppController)
        .directive(Shared.Directives)
        .filter("equals", function () {
        return function (value, equals) { return value == equals; };
    })
        .config(["$sceProvider", "$routeProvider", function ($sceProvider, $routeProvider) {
            $sceProvider.enabled(false);
            $routeProvider
                .when('/', {
                templateUrl: 'templates/viewer/live.html',
                controller: ViewerApp.Controllers.LiveCtrl,
                controllerAs: "live"
            })
                .when('/ask', {
                templateUrl: 'templates/viewer/ask.html',
                controller: ViewerApp.Controllers.QuestionCtrl,
                controllerAs: "qc"
            })
                .when('/submit', {
                templateUrl: 'templates/viewer/submit.html',
                controller: ViewerApp.Controllers.LiveCtrl,
                controllerAs: "live"
            })
                .when('/notsupported', {
                templateUrl: 'templates/viewer/nothing.html',
            })
                .otherwise({
                redirectTo: '/'
            });
        }]);
})(ViewerApp || (ViewerApp = {}));
/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
/// <reference path="../viewer.ts" />
var ViewerApp;
(function (ViewerApp) {
    var Controllers;
    (function (Controllers) {
        var LiveCtrl = (function () {
            function LiveCtrl($scope, $http) {
                this.scope = $scope;
                this.http = $http;
                this.parentApp = $scope["app"];
                this.instanceID = this.parentApp.instanceID;
                var presPreview = document.getElementById("presPreview");
                this.windowManager = new Shared.LocalWindowManager([presPreview.contentWindow]);
                if (this.parentApp.presentation !== undefined) {
                    this.managePresentationView();
                }
                else {
                    window.addEventListener("ffPresentationLoaded", this.managePresentationView.bind(this));
                }
            }
            LiveCtrl.prototype.managePresentationView = function () {
                var _this = this;
                new Shared.GetPresentationStateAPIRequest(this.http, this.instanceID).then(function (data, headers) {
                    if (JSON.stringify(data.data) != JSON.stringify(_this.presentationInstance)) {
                        _this.presentationInstance = data.data;
                        _this.windowManager.commandAll("changeSlide", _this.parentApp.presentation.slideUrls[_this.presentationInstance.currentSlide]);
                        if (_this.presentationInstance.currentContentId && _this.presentationInstance.currentContentId != "") {
                            _this.windowManager.postAll(_this.presentationInstance.currentContentId);
                        }
                    }
                    window.setTimeout(_this.managePresentationView.bind(_this), 300);
                });
            };
            LiveCtrl.$inject = ["$scope", "$http"];
            return LiveCtrl;
        })();
        Controllers.LiveCtrl = LiveCtrl;
    })(Controllers = ViewerApp.Controllers || (ViewerApp.Controllers = {}));
})(ViewerApp || (ViewerApp = {}));
/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
/// <reference path="../viewer.ts" />
var ViewerApp;
(function (ViewerApp) {
    var Controllers;
    (function (Controllers) {
        var QuestionCtrl = (function () {
            function QuestionCtrl($scope, $http) {
                this.scope = $scope;
                this.http = $http;
                this.expandedIndex = -1;
                this.questionText = "";
                this.questionValid = true;
                this.parentApp = $scope["app"];
                this.instanceID = this.parentApp.instanceID;
            }
            QuestionCtrl.prototype.askQuestion = function () {
                var _this = this;
                if (this.questionText.length < 1) {
                    return this.questionValid = false;
                }
                this.questionValid = true;
                var question = {
                    id: undefined,
                    text: this.questionText,
                    timestamp: new Date().getTime(),
                    presentationId: this.parentApp.presentationInstance.presentationId,
                    submitter: { id: "-1", name: "Anonymous User" },
                    type: FFContentType.Question,
                    upvotes: 0,
                    flagged: 0,
                    replies: []
                };
                new Shared.PostContentForPresentationInstance(this.http, this.instanceID, question).then(function (data) {
                    if (data.success) {
                        _this.expandedIndex += 1;
                        _this.questionText = "";
                        _this.parentApp.content.splice(0, 0, question);
                    }
                });
            };
            QuestionCtrl.prototype.expandItem = function (index) {
                if (this.expandedIndex == index) {
                    return this.expandedIndex = -1;
                }
                ;
                this.expandedIndex = index;
            };
            QuestionCtrl.$inject = ["$scope", "$http"];
            return QuestionCtrl;
        })();
        Controllers.QuestionCtrl = QuestionCtrl;
    })(Controllers = ViewerApp.Controllers || (ViewerApp.Controllers = {}));
})(ViewerApp || (ViewerApp = {}));
