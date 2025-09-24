import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class RouteParamDecorator extends ParamExtensionDecorator {
    public constructor(public readonly param?: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (this.param) return req.params[this.param];
        return req.params;
    }
}

/**
 * Injects a route parameter by name.
 */
const RouteParam = ParamExtensionDecorator.createDecorator(RouteParamDecorator);

export default RouteParam;
