import type { Request } from "express";
import { ParamExtensionDecorator } from "../../Abstractions";

class BodyParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request): Promise<Record<string, unknown>> {
        return req.body;
    }
}

/**
 * Injects the parsed request body into the method parameter.
 */
const Body = ParamExtensionDecorator.createDecorator(BodyParamDecorator);

export default Body;
