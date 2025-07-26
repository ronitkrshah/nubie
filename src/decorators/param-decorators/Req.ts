import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class ReqParamDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req;
    }
}

const Req = NubieExtensionParamDecorator.createDecorator(ReqParamDecorator);

export default Req;
