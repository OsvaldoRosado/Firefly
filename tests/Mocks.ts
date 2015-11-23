// Common Firefly Mocks

class Mocks {
	static Request(args:{withUser?:Object,withParams?:Object,withQuery?:Object,logoutCB?:()=>any}={}) {
		return {
			user:args.withUser || null,
			params:args.withParams || {},
			query:args.withQuery || {},
			logout:args.logoutCB||(()=>null)
		}
	}
	static Response(args:{redirectCB?:(any)=>any,sendCB?:(any)=>any}={}) {
		return {
			redirect:args.redirectCB||((s)=>null),
			send:args.sendCB||((s)=>null)
		}
	}
}

export = Mocks;