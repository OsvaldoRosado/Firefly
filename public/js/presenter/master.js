var Config = (function () {
    function Config() {
    }
    Config.HOST = "http://" + window.location.host;
    return Config;
})();
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
var PresenterApp;
(function (PresenterApp) {
    var Controllers;
    (function (Controllers) {
        var SlideCtrl = (function () {
            function SlideCtrl($scope, $http) {
                var _this = this;
                this.scope = $scope;
                this.http = $http;
                this.presRunning = false;
                var sampleId = "59227f68-0818-4493-91df-c4b065a5011b-2";
                this.http.get("/getPresentationFromId/" + sampleId)
                    .then(function (response) {
                    var result = response.data;
                    if (!result.success || result.data.length < 1) {
                        _this.error = "Your presentation was not found!";
                    }
                    _this.currentSlide = 0;
                    _this.slideCount = result.data.length;
                    _this.presName = result.data.name;
                    _this.slideUrls = result.data.slides;
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
