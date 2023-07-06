import Testing from "@/lib/Testing";

export default new class TestHooks {

	async hit(id: string, context?: object): Promise<void> {

		// Abort due to not testing?
		if (!Testing.isTesting)
			return;

		// Abort due to no hooks present?
		let hookIds;

		try {
			hookIds = await (window as any).testing_hooks_ids();
		} catch (ex) {
			return;
		}

		if (hookIds && hookIds.includes(id)) {
			await (window as any).testing_hooks_hit(id, context);
		}
	}

}
