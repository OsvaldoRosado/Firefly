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
    var ReplyQuestionForPresentationInstance = (function (_super) {
        __extends(ReplyQuestionForPresentationInstance, _super);
        function ReplyQuestionForPresentationInstance($http, contentId, content) {
            var reqbody = {
                contentid: contentId,
                data: JSON.stringify(content)
            };
            _super.call(this, $http, "/replyQuestionForPresentationInstance", reqbody, APIMethod.POST);
        }
        return ReplyQuestionForPresentationInstance;
    })(Shared.APIRequest);
    Shared.ReplyQuestionForPresentationInstance = ReplyQuestionForPresentationInstance;
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
                if (this.content) {
                    this.updateRenderDetails();
                }
                $scope.$watch(function () { return this.content && this.content['timestamp']; }.bind(this), this.updateRenderDetails.bind(this));
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
                    isForm: "=",
                    replyValid: "=",
                    onToggle: "&",
                    onReply: "&"
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
    var app = angular.module("viewer", ["ngRoute", "ngAnimate"])
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
                templateUrl: 'public/templates/viewer/live.html',
                controller: ViewerApp.Controllers.LiveCtrl,
                controllerAs: "live"
            })
                .when('/ask', {
                templateUrl: 'public/templates/viewer/ask.html',
                controller: ViewerApp.Controllers.QuestionCtrl,
                controllerAs: "qc"
            })
                .when('/submit', {
                templateUrl: 'public/templates/viewer/submit.html'
            })
                .when('/submit/link', {
                templateUrl: 'public/templates/viewer/submitlink.html',
                controller: ViewerApp.Controllers.SubmitLinkController,
                controllerAs: "link"
            })
                .when('/notsupported', {
                templateUrl: 'public/templates/viewer/nothing.html',
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
                var _this = this;
                this.scope = $scope;
                this.http = $http;
                this.active = true;
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
                $scope.$on("$destroy", function () {
                    _this.active = false;
                });
            }
            LiveCtrl.prototype.managePresentationView = function () {
                var _this = this;
                new Shared.GetPresentationStateAPIRequest(this.http, this.instanceID).then(function (data, headers) {
                    _this.presentationInstance = data.data;
                    _this.windowManager.commandAll("changeSlide", _this.parentApp.presentation.slideUrls[_this.presentationInstance.currentSlide]);
                    if (_this.presentationInstance.currentContentId && _this.presentationInstance.currentContentId != "") {
                        _this.windowManager.postAll(_this.presentationInstance.currentContentId);
                    }
                    if (_this.active == false) {
                        return;
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
            QuestionCtrl.prototype.reply = function (data, questionId) {
                var _this = this;
                if (data.length < 1) {
                    return;
                }
                var replyObj = {
                    id: undefined,
                    text: data,
                    timestamp: new Date().getTime(),
                    presentationId: this.parentApp.presentationInstance.presentationId,
                    submitter: { id: "-1", name: "Anonymous User" },
                    type: FFContentType.Question,
                    upvotes: 0,
                    flagged: 0
                };
                new Shared.ReplyQuestionForPresentationInstance(this.http, questionId, replyObj).then(function (data) {
                    for (var i = 0; i < _this.parentApp.content.length; i++) {
                        if (_this.parentApp.content[i].id === questionId) {
                            _this.parentApp.content[i] = data.data;
                            break;
                        }
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
/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
/// <reference path="../viewer.ts" />
var ViewerApp;
(function (ViewerApp) {
    var Controllers;
    (function (Controllers) {
        var SubmitLinkController = (function () {
            function SubmitLinkController($scope, $http) {
                this.scope = $scope;
                this.http = $http;
                this.loading = false;
                this.loaded = false;
                var parentApp = $scope["app"];
                this.instanceID = parentApp.instanceID;
            }
            SubmitLinkController.prototype.changed = function () {
                var _this = this;
                this.loading = true;
                if (this.link.match(/^.{0,12}[:\.]youtube\..{2,4}/) != null) {
                    var ids = this.link.match(/\?v=(.{11,15})/);
                    if (ids.length < 2) {
                        ids = this.link.match(/\/(.{11,15})$/);
                    }
                    if (ids.length < 2) {
                        alert("Could not identify valid video ID in YouTube link: " + this.link);
                        return;
                    }
                    var id = ids[1];
                    var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + id + "&key=AIzaSyB_w83v18rHCYGklMFjUhqLMTzmB9JgjuY";
                    this.http.get(url).then(function (data) {
                        _this.loading = false;
                        _this.loaded = true;
                        var snippet;
                        try {
                            snippet = data.data.items[0].snippet;
                        }
                        catch (e) {
                            alert("YouTube API provided invalid data. The video may have been deleted.");
                            return;
                        }
                        _this.preview = {
                            id: undefined,
                            presentationId: undefined,
                            type: FFContentType.Video,
                            submitter: undefined,
                            timestamp: new Date().getTime(),
                            upvotes: 0,
                            flagged: 0,
                            title: snippet["title"],
                            youtubeId: id,
                            channelTitle: snippet["channelTitle"],
                            text: ""
                        };
                    });
                }
                else {
                    var img = new Image();
                    img.onerror = function () {
                        alert("Sorry, web pages aren't supported at this time. Please link directly to an image");
                    };
                    img.onload = function () {
                        _this.scope.$apply(function () {
                            _this.loading = false;
                            _this.loaded = true;
                            _this.preview = {
                                id: undefined,
                                presentationId: undefined,
                                type: FFContentType.Image,
                                submitter: undefined,
                                timestamp: new Date().getTime(),
                                upvotes: 0,
                                flagged: 0,
                                link: _this.link,
                                text: ""
                            };
                        });
                    };
                    img.src = this.link;
                }
            };
            SubmitLinkController.prototype.post = function () {
                new Shared.PostContentForPresentationInstance(this.http, this.instanceID, this.preview).then(function (ret) {
                    if (!ret.success) {
                        return alert("Could not post content. Please try again later.");
                    }
                    var newId = ret.data.id;
                    window.location.hash = "/content/" + newId;
                });
            };
            SubmitLinkController.prototype.cancel = function () {
                window.location.hash = "/";
            };
            SubmitLinkController.$inject = ["$scope", "$http"];
            return SubmitLinkController;
        })();
        Controllers.SubmitLinkController = SubmitLinkController;
    })(Controllers = ViewerApp.Controllers || (ViewerApp.Controllers = {}));
})(ViewerApp || (ViewerApp = {}));
