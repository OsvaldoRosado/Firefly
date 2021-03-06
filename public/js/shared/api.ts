/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../typings/angular/angular.d.ts" />
/// <reference path="../typings/firefly/firefly.d.ts" />
/// <reference path="./config.ts" />

module Shared {
	
	export enum APIMethod {
		GET,
		POST
	}
	
	export class APIRequest<T> {
		onsuccess: (data: T, headers: ng.IHttpHeadersGetter) => void;
		onfail: (error: Object) => void;
	
		constructor($http: ng.IHttpService, endpoint: string, data: Object, method: APIMethod = APIMethod.GET) {
			
			// Create the URL
			if (endpoint[0] !== "/") {endpoint = "/" + endpoint;}
			endpoint = Config.HOST + "/api" + endpoint;
			
			// This class mostly just defers to Angular, with some secret sauce added
			if (method == APIMethod.GET) {
				if (data !== undefined && data !== {}) {
					endpoint += this.queryFormat(data);
				}
				$http.get(endpoint).then(this.finish.bind(this)).catch(this.fail.bind(this));
			} else {
				$http.post(endpoint, data).then(this.finish.bind(this)).catch(this.fail.bind(this));
			}
		}
		
		// Convenient Wrappers
		finish(response: ng.IHttpPromiseCallback<Object>) {
			if (response['status'] !== 200) {return this.fail(response);}
			this.onsuccess(response['data'], response['headers']);
		}
		fail(error: Object) {
			if (this.onfail !== undefined) {this.onfail(error);}
			console.log(error);
		}
		
		// Turn a Javascript object into a URL-formatted GET string
		queryFormat(data: Object) {
			var s = [];
			for (var i in data) {
				s.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
			}
			return "?" + s.join("&").replace(/%20/g, "+");
		}
		
		// Matches Promise
		then(f: (data: T, headers: ng.IHttpHeadersGetter) => void, e?: (error: Object) => void) {
			this.onsuccess = f; 
			if (e !== undefined) {this.onfail = e;}
			return this;
		}
		catch(f: (error: Object) => void) {this.onfail = f; return this;}
	}
	
	
	// PRESENTATIONS =======================================================================

	export class GetPresentationAPIRequest extends Shared.APIRequest<FFPresentation> {
		constructor($http: ng.IHttpService, presentationId: string) {
			super($http, "/getPresentationFromId/" + presentationId, {});
		}
	}
	
	
	// PRESENTATION INSTANCES ==============================================================

	export class GeneratePresentationInstanceAPIRequest extends Shared.APIRequest<FFPresentationInstance> {
		constructor($http: ng.IHttpService, presentationId: string) {
			super($http, "/generatePresentationInstance/" + presentationId, {});
		}
	}

	export class PostPresentationStateAPIRequest extends Shared.APIRequest<Boolean> {
		constructor($http: ng.IHttpService, instanceId: string, curslide: number, curContentId?: string) {
			var reqbody = {
				instanceid: instanceId,
				curslide: curslide,
				curcontentid: undefined
			};
			if(curContentId != undefined){
				reqbody.curcontentid = curContentId;
			}
			super($http, "/postCurrentState", reqbody, APIMethod.POST);
		}
	}

	export class GetPresentationStateAPIRequest extends Shared.APIRequest<FFPresentationInstance> {
		constructor($http: ng.IHttpService, instanceId: string) {
			super($http, "/getCurrentState/" + instanceId, {});
		}
	}

	export class GenerateShortInstanceURLAPIRequest extends Shared.APIRequest<string> {
		constructor($http: ng.IHttpService, instanceId: string) {
			super($http, "/GenerateShortInstanceURL/" + instanceId, {});
		}
	}
	
	
	// PRESENTATION CONTENT ================================================================
	
	export class PostContentForPresentationInstance extends Shared.APIRequest<Object> {
		constructor($http: ng.IHttpService, instanceId: string, content: FFGenericContent) {
			var reqbody = {
				instanceid: instanceId,
				data: JSON.stringify(content)
			};
			super($http, "/postContentForPresentationInstance", reqbody, APIMethod.POST);
		}
	}
	
	export class GetContentForPresentationInstance extends Shared.APIRequest<FFGenericContent[]> {
		constructor($http: ng.IHttpService, instanceId: string) {
			super($http, "/getContentForPresentationInstance/" + instanceId, {});
		}
	}

	export class ReplyQuestionForPresentationInstance extends Shared.APIRequest<Object> {
		constructor($http: ng.IHttpService, contentId: string, content: FFTextContent) {
			var reqbody = {
				contentid: contentId,
				data: JSON.stringify(content)
			};
			super($http, "/replyQuestionForPresentationInstance", reqbody, APIMethod.POST);
		}
	}
	
	
	// LOGIN ===============================================================================
	
	export class GetCurrentUserInfo extends Shared.APIRequest<FFGenericContent[]> {
		constructor($http: ng.IHttpService) {
			super($http, "/GetCurrentUserInfo/", {});
		}
	}
}