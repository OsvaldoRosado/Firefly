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
			endpoint = Config.HOST + endpoint;
			
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
}