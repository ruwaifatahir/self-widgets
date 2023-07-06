export default (window as any).TestRegistry = new class TestRegistry {

    mapping: any = {};

    // TODO High: Disable when not testing, to avoid we will use it production time.
    public get(name: string): any {
        return this.mapping[name];
    }

    public set(name: string, value: any): void {
        this.mapping[name] = value;
    }

    public setMultiple(items: any): void {
        Object.assign(this.mapping, items);
    }

}
