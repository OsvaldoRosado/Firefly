/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/shared/api.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared {
	
	export class UpvoteAPIRequest extends APIRequest<boolean> {
		constructor($http: ng.IHttpService, contentId: string) {
			super($http, "/UpvotePresContent", {id: contentId}, APIMethod.GET);
		}
	}
		
}