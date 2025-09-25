import type { Request } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class ReqParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request): Promise<Request> {
        return req;
    }
}

/**
 * Injects the raw Express `req` object.
 */
const Req = ParamExtensionDecorator.createDecorator(ReqParamDecorator);

export default Req;
