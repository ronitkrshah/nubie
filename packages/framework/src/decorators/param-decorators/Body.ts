import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";

class BodyParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.body;
    }
}

/**
 * Injects the parsed request body into the method parameter.
 */
const Body = ParamExtensionDecorator.createDecorator(BodyParamDecorator);

export default Body;
