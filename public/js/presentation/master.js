var Config = (function () {
    function Config() {
    }
    Config.HOST = "http://" + window.location.host;
    return Config;
})();
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
