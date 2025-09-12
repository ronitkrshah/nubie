import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";

class ReqParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req;
    }
}

const Req = ParamExtensionDecorator.createDecorator(ReqParamDecorator);

export default Req;
