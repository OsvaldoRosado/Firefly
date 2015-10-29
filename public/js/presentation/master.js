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
})(Shared || (Shared = {}));
var PresentationApp;
(function (PresentationApp) {
    var Controllers;
    (function (Controllers) {
        var ViewableCtrl = (function () {
            function ViewableCtrl($scope) {
                var _this = this;
                window.addEventListener("message", function (event) {
                    if (event.origin !== Config.HOST) {
                        return;
                    }
                    var order = JSON.parse(event.data);
                    switch (order.action) {
                        case "changeSlide":
                            _this.slideUrl = order.data;
                            break;
                        case "showOverlay":
                            _this.overlayUrl = order.data;
                            _this.qaActive = false;
                            _this.overlayActive = true;
                            break;
                        case "hideOverlay":
                            _this.overlayUrl = undefined;
                            _this.overlayActive = false;
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
                    }
                    $scope.$apply();
                });
            }
            return ViewableCtrl;
        })();
        Controllers.ViewableCtrl = ViewableCtrl;
    })(Controllers = PresentationApp.Controllers || (PresentationApp.Controllers = {}));
})(PresentationApp || (PresentationApp = {}));
var PresentationApp;
(function (PresentationApp) {
    angular.module("presentation", [])
        .controller(PresentationApp.Controllers);
})(PresentationApp || (PresentationApp = {}));
