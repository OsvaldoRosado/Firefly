module Shared{

	/**
	 * A special version of the Window object that should only be used for
	 * windows opened locally. In particular, calling `postMessage` does not
	 * require a target domain. The `command` function is a utility to post a 
	 * message with the instruction formally separated from the arguments.
	 */
	export class LocalWindow{

		theWindow: Window;

		constructor(wnd: Window){
			this.theWindow = wnd;
		}

		postMessage(data: string){
			this.theWindow.postMessage(data, Config.HOST);
		}

		command(action: string, data: string) {
			this.postMessage(
				JSON.stringify({ action: action, data: data })
			);
		}

		close(){
			this.theWindow.close();
		}
	}

	/**
	 * Utility for talking to clone windows. Can post a message to a set of 
	 * LocalWindows.
	 */
	export class LocalWindowManager{

		windows: Array<LocalWindow>;

		constructor(theWindows: Array<Window>){
			this.windows = theWindows.map((wnd) => new LocalWindow(wnd));
		}

		postAll(data: string){
			this.windows.forEach((wnd) => wnd.postMessage(data));
		}

		commandAll(action: string, data: string){
			this.windows.forEach((wnd) => wnd.command(action, data));
		}

		commandOne(id: number, action: string, data: string){
			this.windows[id].command(action, data);
		}

		closeAll() {
			this.windows.forEach((wnd) => wnd.close());
		}
	}
}