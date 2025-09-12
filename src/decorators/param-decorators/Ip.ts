import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";

class IpDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.ip;
    }
}

const Ip = ParamExtensionDecorator.createDecorator(IpDecorator);

export default Ip;
