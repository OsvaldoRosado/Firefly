/// <reference path="../../../shared/data-types.ts" />
/// <reference path="../../js/shared/api.ts" />
/// <reference path="../../js/typings/angular/angular.d.ts" />

module Shared {

	export class UpvoteAPIRequest extends APIRequest<boolean> {
		constructor($http: ng.IHttpService, contentId: string) {
			super($http, "/UpvotePresentationContent/" + contentId, APIMethod.GET);
		}
	}

	export class FlagAPIRequest extends APIRequest<boolean> {
		constructor($http: ng.IHttpService, contentId: string) {
			super($http, "/FlagPresentationContent/" + contentId, APIMethod.GET);
		}
	}

}
