export default class ErrorEx extends Error {

	constructor(msg: string, data: any) {

		//
		super(msg);

		//
		console.error('⚠️  Exception data:', data);
	}

}
