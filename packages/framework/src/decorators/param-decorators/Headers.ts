import type { Request } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";
import type { IncomingHttpHeaders } from "http";

class HeadersParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request): Promise<IncomingHttpHeaders> {
        return req.headers;
    }
}

/**
 * Injects request headers into the method parameter.
 */
const Headers = ParamExtensionDecorator.createDecorator(HeadersParamDecorator);

export default Headers;
