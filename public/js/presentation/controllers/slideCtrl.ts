module PresentationApp.Controllers{
	export class SlideCtrl{

		slideUrl: string;
		slideId: string;

		constructor(){
			this.slideId = Utils.getUrlHashParam("id");
			this.slideUrl = Utils.processingServerImg(this.slideId);
		}
	}
}