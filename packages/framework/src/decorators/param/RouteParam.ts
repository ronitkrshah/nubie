import type { Request } from "express";
import { ParamExtensionDecorator } from "../../abstractions";

class RouteParamDecorator extends ParamExtensionDecorator {
    public constructor(public readonly param?: string) {
        super();
    }

    public async executeAsync(req: Request): Promise<unknown> {
        if (this.param) return req.params[this.param];
        return req.params;
    }
}

/**
 * Injects a route parameter by name.
 */
const RouteParam = ParamExtensionDecorator.createDecorator(RouteParamDecorator);

export default RouteParam;
