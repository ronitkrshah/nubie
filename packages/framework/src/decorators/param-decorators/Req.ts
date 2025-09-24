import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class ReqParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req;
    }
}

/**
 * Injects the raw Express `req` object.
 */
const Req = ParamExtensionDecorator.createDecorator(ReqParamDecorator);

export default Req;
