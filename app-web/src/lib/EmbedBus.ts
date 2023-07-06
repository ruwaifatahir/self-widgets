import {type IframePayload} from "@/embed";

export type WidgetContext = {
	id: number;
	options: {
		type: 'resolve';
	};
}

export default new class EmbedBus
{
	public widgetContext?: WidgetContext;

	constructor() {
		this.initWidgetContext();
	}

	private initWidgetContext()
	{
		// Error due to not present?
		let urlParams = new URLSearchParams(window.location.search);
		let contextParam = urlParams.get('context');

		if(!contextParam)
			throw new Error('No context query parameter present!');

		// Error due to invalid JSON?
		let context = JSON.parse(contextParam);

		if(!context)
			throw new Error('Invalid JSON given!');

		// Set
		this.widgetContext = context;
	}

	public getWidgetOptions<T>(): T {
		return this.widgetContext!.options as T;
	}

	public postMessage(name: string, args: any = null)
	{
		// Post
		window.parent.postMessage({
			type: 'self.widgets.' + name,
			widgetId: this.widgetContext!.id,
			args,
		} as IframePayload, '*');
	}

}
