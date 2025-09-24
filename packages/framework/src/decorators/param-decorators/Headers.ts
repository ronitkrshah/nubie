import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class HeadersParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.headers;
    }
}

/**
 * Injects request headers into the method parameter.
 */
const Headers = ParamExtensionDecorator.createDecorator(HeadersParamDecorator);

export default Headers;
