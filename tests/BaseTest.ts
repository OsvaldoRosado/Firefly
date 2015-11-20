class BaseTest {
	
	public test() {
		// Override for test
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
		}
		
		return {success:!failed,reason:reason}
	}
}

export = BaseTest;