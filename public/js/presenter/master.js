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
        var SlideCtrl = (function () {
            function SlideCtrl($http) {
                this.http = $http;
                this.presRunning = false;
            }
            SlideCtrl.prototype.presCommand = function (action, data) {
                this.presWindow.postMessage(JSON.stringify({
                    action: action, data: data
                }), Config.HOST);
            };
            SlideCtrl.prototype.updateSlide = function () {
                this.presCommand("changeSlide", this.slideUrls[this.currentSlide]);
            };
            SlideCtrl.prototype.startPresentation = function () {
                var _this = this;
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
                    _this.presRunning = true;
                    _this.presWindow = window.open("presentation.html", _this.presName, "width=800,height=600");
                    setTimeout(function () { return _this.updateSlide(); }, 1000);
                }, function () { return _this.error = "Your presentation was not found!"; });
            };
            SlideCtrl.prototype.prevSlide = function () {
                this.currentSlide--;
                this.updateSlide();
            };
            SlideCtrl.prototype.nextSlide = function () {
                this.currentSlide++;
                this.updateSlide();
            };
            SlideCtrl.$inject = ["$http"];
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
