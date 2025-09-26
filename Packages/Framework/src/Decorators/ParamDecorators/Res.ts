import type { Request, Response } from "express";
import { ParamExtensionDecorator } from "../../Abstractions";

class ResParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(_req: Request, res: Response): Promise<unknown> {
        return res;
    }
}

/**
 * Injects the raw Express `res` object.
 */
const Res = ParamExtensionDecorator.createDecorator(ResParamDecorator);

export default Res;
