import BaseTest = require("../BaseTest");
import BaseModel = require("../../models/BaseModel");

class InvalidTestModel extends BaseModel.BaseModel {
	public id = "testId";
	public property = "property";
	public _hiddenProperty = "hidden";
}

// InvalidTestModel with a model identifier
class TestModel extends InvalidTestModel {
	protected static _modelIdentifier:string = "TestModel";
}

class BaseModelTest extends BaseTest {
	public test() {		
		// Test raw model
		var failed = true;
		try {
			new BaseModel.BaseModel();
		} catch (e) {
			failed = false;
		}
		this.assert(!failed, "Raw BaseModel cannot be used.");
		
		
		// Test model without modelIdentifier
		var failed = true;
		try {
			new InvalidTestModel();
		} catch (e) {
			failed = false;
		}
		this.assert(!failed, "Models must have model identifiers.");
		
		// Test model serialization
		var model = new TestModel();
		var deserializedModel = JSON.parse(JSON.stringify(model));
		this.assert(model.id == deserializedModel.id && model.id == "testId",
			"Model ID should be kept through serialization");
		this.assert(model.property == deserializedModel.property && model.property == "property",
			"Model properties should be kept through serialization");
		this.assert(model._hiddenProperty && !deserializedModel._hiddenProperty,
			"Model properties w/ underscores shouldn't kept through serialization");
	}
}

export = BaseModelTest