import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class ResParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return res;
    }
}

/**
 * Injects the raw Express `res` object.
 */
const Res = ParamExtensionDecorator.createDecorator(ResParamDecorator);

export default Res;
