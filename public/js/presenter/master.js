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
            endpoint = Config.HOST + endpoint;
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
})(Shared || (Shared = {}));
var PresenterApp;
(function (PresenterApp) {
    var Controllers;
    (function (Controllers) {
        var ContentCtrl = (function () {
            function ContentCtrl($scope, $http) {
                this.scope = $scope;
                this.http = $http;
                this.content = [
                    {
                        url: "http://placehold.it/300x300",
                        caption: "Test caption",
                        user: "Rick",
                        score: 0
                    }
                ];
                this.questions = [
                    {
                        text: "How do I art?",
                        user: "Mr. Meeseeks",
                        score: 0,
                        replies: [{
                                text: "Look inside yourself",
                                user: "Pensylvester",
                                score: 0
                            }]
                    }
                ];
            }
            ContentCtrl.$inject = ["$scope", "$http"];
            return ContentCtrl;
        })();
        Controllers.ContentCtrl = ContentCtrl;
    })(Controllers = PresenterApp.Controllers || (PresenterApp.Controllers = {}));
})(PresenterApp || (PresenterApp = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../shared/api.ts" />
var PresenterApp;
(function (PresenterApp) {
    var Controllers;
    (function (Controllers) {
        var GetPresentationAPIRequest = (function (_super) {
            __extends(GetPresentationAPIRequest, _super);
            function GetPresentationAPIRequest($http, presentationId) {
                _super.call(this, $http, "/getPresentationFromId/" + presentationId, {});
            }
            return GetPresentationAPIRequest;
        })(Shared.APIRequest);
        var SlideCtrl = (function () {
            function SlideCtrl($scope, $http) {
                var _this = this;
                this.scope = $scope;
                this.presRunning = false;
                var sampleId = "59227f68-0818-4493-91df-c4b065a5011b-2";
                new GetPresentationAPIRequest($http, sampleId)
                    .then(function (result) {
                    _this.currentSlide = 0;
                    _this.slideCount = result.data.slideCount;
                    _this.presName = result.data.name;
                    _this.slideUrls = result.data.slideUrls;
                }, function () { return _this.error = "Your presentation was not found!"; });
            }
            SlideCtrl.prototype.presCommand = function (action, data) {
                this.presWindow.postMessage(angular.toJson({ action: action, data: data }), Config.HOST);
            };
            SlideCtrl.prototype.updateSlide = function () {
                this.presCommand("changeSlide", this.slideUrls[this.currentSlide]);
            };
            SlideCtrl.prototype.startPresentation = function () {
                var _this = this;
                this.presRunning = true;
                this.presWindow = window.open("presentation.html", this.presName, "width=802,height=450");
                setTimeout(function () { return _this.updateSlide(); }, 1000);
            };
            SlideCtrl.prototype.prevSlide = function () {
                this.currentSlide--;
                this.updateSlide();
            };
            SlideCtrl.prototype.nextSlide = function () {
                this.currentSlide++;
                this.updateSlide();
            };
            SlideCtrl.prototype.toggleOverlay = function (url) {
                if (url !== this.currentOverlay) {
                    this.currentOverlay = url;
                    this.presCommand("showOverlay", url);
                }
                else {
                    this.currentOverlay = undefined;
                    this.presCommand("hideOverlay", "");
                }
            };
            SlideCtrl.prototype.toggleQASidebar = function (question, showReplies) {
                if (!this.currentQA || this.currentQA.text !== question.text) {
                    this.currentQA = question;
                    this.presCommand("showQASidebar", angular.toJson(question));
                }
                else {
                    this.currentQA = undefined;
                    this.presCommand("hideQASidebar", "");
                }
            };
            SlideCtrl.$inject = ["$scope", "$http"];
            return SlideCtrl;
        })();
        Controllers.SlideCtrl = SlideCtrl;
    })(Controllers = PresenterApp.Controllers || (PresenterApp.Controllers = {}));
})(PresenterApp || (PresenterApp = {}));
var PresenterApp;
(function (PresenterApp) {
    angular.module("presenter", [])
        .controller(PresenterApp.Controllers);
})(PresenterApp || (PresenterApp = {}));
