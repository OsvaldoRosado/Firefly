module PresenterApp.Controllers{
	export class SlideCtrl{

		http: ng.IHttpService;

		presRunning: boolean;
		presWindow: Window;

		presName: string;
		currentSlide: number;
		slideCount: number;
		slideUrls: string[];

		error: string;

		static $inject = ["$http"];

		constructor($http: ng.IHttpService){
			this.http = $http;
			this.presRunning = false;

			//TODO: Make this actually work.
			window.addEventListener("message", () => this.updateSlide());
		}

		presCommand(action: string, data: string){
			this.presWindow.postMessage(JSON.stringify({
				action: action, data: data
			}), Config.HOST);
		}

		updateSlide(){
			this.presCommand("changeSlide", this.slideUrls[this.currentSlide]);
		}

		startPresentation(){
			var sampleId = "59227f68-0818-4493-91df-c4b065a5011b-2";
			this.http.get("/getPresentationFromId/" + sampleId)
				.then((response: ng.IHttpPromiseCallbackArg<ApiResponses.PresentationFromId>) => {
					var result = response.data;
					if(!result.success || result.data.length < 1){
						this.error = "Your presentation was not found!";
					}

					this.currentSlide = 0;
					this.slideCount = result.data.length;
					this.presName = result.data.name;
					this.slideUrls = result.data.slides;
					this.presRunning = true;
					this.presWindow = window.open(
						"presentation.html", this.presName, "width=800,height=600"
					);

					this.updateSlide();
				}, () => this.error = "Your presentation was not found!");
		}

		prevSlide() {
			this.currentSlide--;
			this.updateSlide();
		}

		nextSlide(){
			this.currentSlide++;
			this.updateSlide();
		}

		}
}