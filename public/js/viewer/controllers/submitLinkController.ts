/// <reference path="../../../../shared/data-types.ts" />
/// <reference path="../../typings/angular/angular.d.ts" />
/// <reference path="../../typings/firefly/firefly.d.ts" />
/// <reference path="../../shared/config.ts" />
/// <reference path="../viewer.ts" />
module ViewerApp.Controllers {

	/**
	 * Angular controller for showing the live content stream and presentation view
	 */
	export class SubmitLinkController {
		scope: ng.IScope;
		http: ng.IHttpService;
		instanceID: string;

		link: string;
		preview: FFGenericContent;

		loading: boolean;
		loaded: boolean;

		static $inject = ["$scope", "$http"];
		constructor($scope, $http){
			this.scope = $scope;
			this.http = $http;

			this.loading = false;
			this.loaded = false;

			// Get the instance ID from the parent
			// This is the sort of strong coupling your mom warned you about.
			// But, it cuts out 2 API requests - Worth it!
			var parentApp = <ViewerApp.AppController>$scope["app"];
			this.instanceID = parentApp.instanceID;
		}

		/**
		 * Runs whenever the link text changes meaningfully (e.g. not after every keystroke)
		 */
		changed(){
			this.loading = true;

			// YOUTUBE LINKS =====================================================================

			if (this.link.match(/^.{0,12}[:\.]youtube\..{2,4}/) != null) {
				var ids = this.link.match(/\?v=(.{11,15})/);
				if (ids.length < 2) {
					ids = this.link.match(/\/(.{11,15})$/);
				}
				if (ids.length < 2) {
					alert(`Could not identify valid video ID in YouTube link: ${this.link}`);
					return;
				}

				// It's generally really bad practice to include API keys in client-facing code.
				// However, we've restricted the endpoints our key has access to.
				// Whatcha gonna do with that, hackers? Look up Video IDs?
				var id = ids[1];
				var url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyB_w83v18rHCYGklMFjUhqLMTzmB9JgjuY`
				this.http.get(url).then((data)=>{
					this.loading = false;
					this.loaded = true;

					var snippet;
					try {
						snippet = data.data.items[0].snippet;
					} catch(e) {
						alert("YouTube API provided invalid data. The video may have been deleted.");
						return;
					}

					this.preview = <FFYoutubeContent>{
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

			// IMAGE LINKS =======================================================================

			} else {
				var img = new Image();

				// If this is not a valid image, warn the user
		    img.onerror = ()=> {
					alert("Sorry, web pages aren't supported at this time. Please link directly to an image");
				}

				// Otherwise, we're good to go
		    img.onload = ()=> {
					this.scope.$apply(()=>{
						this.loading = false;
						this.loaded = true;

						this.preview = <FFLinkContent>{
							id: undefined,
							presentationId: undefined,
							type: FFContentType.Image,
							submitter: undefined,
							timestamp: new Date().getTime(),
							upvotes: 0,
							flagged: 0,
							link: this.link,
							text: ""
						};
					});
				}

		    img.src = this.link
			}
		}

		/**
		 * Actually post the content to the server
		 */
		post() {
			new Shared.PostContentForPresentationInstance(this.http, this.instanceID, this.preview).then((ret)=>{
				if (!ret.success){
					return alert("Could not post content. Please try again later.");
				}
				var newId = ret.data.id;
				window.location.hash = "/content/" + newId
			});
		}

		/**
		 * Just go back home
		 */
		cancel() {
			window.location.hash = "/";
		}
	}

}
