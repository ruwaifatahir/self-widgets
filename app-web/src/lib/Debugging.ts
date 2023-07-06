export default new class Debugging {

	public get isDebugging(): boolean {
		return document.location.port !== '' && parseInt(document.location.port) >= 3000;
	}

	public get isDeveloperItself(): boolean {
		return document.location.port !== '' && parseInt(document.location.port) == 5050;
	}

	public log(instance: any, ...logArgs: any[]) {

		// Abort due to not debugging?
		if (!this.isDebugging)
			return;

		// Get formatted caller.
		let callerName = '?';

		if (instance?.$options?.__file)
			callerName = instance.$options.__file.split('/').pop().split('.')[0];

		else if (instance?.constructor)
			callerName = instance?.constructor.name;

		// Delegate
		console.info('%c[' + callerName + ']%c', 'color: orange', 'color: black', ...logArgs);
	}

}