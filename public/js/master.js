var Config = (function () {
    function Config() {
    }
    Config.PROCESSING_SERVER = "http://vm.onfirefly.ws";
    Config.PROCESSING_SERVER_IMG_DIR = "images";
    return Config;
})();
var Utils;
(function (Utils) {
    function getUrlHashParam(key) {
        var matches = location.hash.match(new RegExp(key + '=([^&]*)'));
        return matches ? matches[1] : null;
    }
    Utils.getUrlHashParam = getUrlHashParam;
    function processingServerImg(loc) {
        return Config.PROCESSING_SERVER + "/" + Config.PROCESSING_SERVER_IMG_DIR
            + "/" + loc;
    }
    Utils.processingServerImg = processingServerImg;
})(Utils || (Utils = {}));
var PresentationApp;
(function (PresentationApp) {
    var Controllers;
    (function (Controllers) {
        var SlideCtrl = (function () {
            function SlideCtrl() {
                this.slideId = Utils.getUrlHashParam("id");
                this.slideUrl = Utils.processingServerImg(this.slideId);
            }
            return SlideCtrl;
        })();
        Controllers.SlideCtrl = SlideCtrl;
    })(Controllers = PresentationApp.Controllers || (PresentationApp.Controllers = {}));
})(PresentationApp || (PresentationApp = {}));
var PresentationApp;
(function (PresentationApp) {
    angular.module("presentation", [])
        .controller(PresentationApp.Controllers);
})(PresentationApp || (PresentationApp = {}));
