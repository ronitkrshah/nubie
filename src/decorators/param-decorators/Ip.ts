import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";

class IpDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.ip;
    }
}

/**
 * Injects the client's IP address into the method parameter.
 */
const Ip = ParamExtensionDecorator.createDecorator(IpDecorator);

export default Ip;
