// Firefly Global Configuration

class Configuration {
	public static DEFAULT_PORT = 8080;
	public static DISPLAY_NAME = "Firefly";
	public static PROCESSING_SERVER = "http://vm.onfirefly.ws";
	public static FILE_SERVER = "https://fireflypresentations.blob.core.windows.net";
	public static STATIC_DIR = "./public/";
	public static PAGE_SUFFIX = ".html";
	public static CONNECTION_STRING_FILE = "db_connection.txt";
	public static CONNECTION_STRING_ENV = "MONGODB_CONNECTION_STRING";
}

export = Configuration;