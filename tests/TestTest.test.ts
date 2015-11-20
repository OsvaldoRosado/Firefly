import BaseTest = require("./BaseTest");

class TestTest extends BaseTest {
	public test() {
		this.assert(false, "Test Failure");
	}
}

export = TestTest