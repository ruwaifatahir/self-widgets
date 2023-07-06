import ErrorEx from "@/lib/ErrorEx";

type Widget = {
	id: number,
	container: HTMLElement,
	options: any,
	iframe?: HTMLIFrameElement,
	modalIframe?: HTMLIFrameElement,
}

export type IframePayload = {
	type: string,
	widgetId: number,
	args?: any,
}

new class SelfWidgetsEmbed {

	private widgets: Widget[] = [];
	private nextWidgetId = 1;

	constructor() {

		// Set ref on window, for future developers.
		(window as any).selfWidgetsEmbed = this;

		// Listen for DOM ready and init widgets.
		document.addEventListener('DOMContentLoaded', (event) => this.initWidgets());

		//
		this.initBus();
	}

	private initWidgets() {

		// Init each widget
		for (let container of Array.from(document.querySelectorAll('div[data-self-widget]')))
			this.initWidget(container as HTMLElement);
	}

	private initWidget(container: HTMLElement) {

		// Error due to invalid options?
		let options = JSON.parse(container.dataset.selfWidget || '');

		if (!options)
			throw new Error('Invalid options! Is it invalid JSON?');

		// Store
		let widget: Widget = {
			id: this.nextWidgetId++,
			container,
			options,
		};

		this.widgets.push(widget);

		// Init iframe.
		widget.iframe = this.initWidgetIframe(container, widget);
	}

	private getWidgetById(id: number): Widget {

		// Error due to widget not found?
		let result =  this.widgets.find(widget => widget.id == id);

		if(!result)
			throw new ErrorEx('Could not found widget!', { id });

		//
		return result;
	}

	private initWidgetIframe(container: HTMLElement, widget: Widget) {

		// Init iframe.
		let iframe = document.createElement('iframe');

		iframe.width = '100%';
		iframe.frameBorder = 'no';
		iframe.scrolling = 'no';
		iframe.src = '/index.html?context=' + window.encodeURIComponent(JSON.stringify(this.getIframeContext(widget)));

		// Append iframe.
		container.append(iframe);

		//
		return iframe;
	}

	private initBus()
	{
		// Listen for posted messages.
		window.addEventListener("message", (event) => {

			// Abort due to unknown origin?
			if (new URL(event.origin).hostname !== new URL(import.meta.env.VITE_APP_URL).hostname)
				return;

			// Abort due to no a payload of ours?
			if(!event.data?.type?.startsWith('self.widgets.'))
				return;

			// Get widget.
			let widget = this.getWidgetById(event.data.widgetId);

			// Delegate
			let payload = event.data as IframePayload;

			this.processBusPayload(widget, payload);
		});
	}

	private processBusPayload(widget: Widget, payload: IframePayload)
	{
		// Delegate
		if(payload.type === 'self.widgets.openModal')
			this.openModal(widget, payload.args);

		else if(payload.type === 'self.widgets.closeModal')
			this.closeModal(widget);

		else if(payload.type === 'self.widgets.setHeight')
			this.setHeight(widget, payload.args);

		// Error due to unknown type?
		else
			throw new ErrorEx('Unknown payload!', payload);
	}

	private openModal(widget: Widget, args: any)
	{
		// Close existing modal?
		if(widget.modalIframe)
			this.closeModal(widget);

		// Enrich context.
		let context = this.getIframeContext(widget);

		context.options.showModal = args;

		// Init iframe.
		let iframe = document.createElement('iframe');

		iframe.style.background = 'rgba(0, 0, 0, .5)';
		iframe.style.position = 'fixed';
		iframe.style.inset = '0';
		iframe.style.width = '100%';
		iframe.style.height = '100%';
		iframe.frameBorder = 'no';

		iframe.src = '/index.html?context=' + window.encodeURIComponent(JSON.stringify(context));

		// Set
		widget.modalIframe = iframe;

		// Append iframe.
		document.body.append(iframe);
	}

	private closeModal(widget: Widget) {

		// Abort due to already closed?
		if(!widget.modalIframe)
			return;

		// Remove iframe.
		widget.modalIframe.parentElement!.removeChild(widget.modalIframe);

		// Clear
		widget.modalIframe = undefined;
	}

	private setHeight(widget: Widget, args: { height: number })
	{
		// Set height on iframe.
		widget.iframe!.height = args.height + '';
	}

	private getIframeContext(widget: Widget) {
		return {
			id: widget.id,
			options: widget.options,
		};
	}
}
