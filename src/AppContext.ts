import { TClass } from "./interfaces";

class AppContext {
    private _classDecorators = new Map<string, TClass>();

    public get classDecorators() {
        return Array.from(this._classDecorators.values());
    }

    public addClassDecorator(decorator: TClass) {
        this._classDecorators.set(decorator.name, decorator);
    }
}

export default new AppContext();
