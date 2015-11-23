class BaseTest {
	
	private stubbed = [];
	
	public test() {
		// Override for test
	}
	
	public stub(object,method,newBody) {
		var old = object[method];
		object[method] = newBody;
		this.stubbed.push([object,method,old]);
		return {recover:()=>object[method]=old};
	}
	
	protected assert(test:boolean,reason:string) {
		if(!test) {
			throw new Error(reason);
		}
	}
	
	public static run() {
		var test = new this();
		var failed = false;
		var reason = "";
		
		try {
			test.test();
		} catch (e) {
			failed = true;
			reason = e.toString();
			//console.log(e.stack);
		}
		
		test.recoverStubbedFunctions();
		
		return {success:!failed,reason:reason}
	}
	
	private recoverStubbedFunctions() {
		this.stubbed.forEach((stub)=>{
			stub[0][stub[1]] = stub[2];
		});
	}
}

export = BaseTest;