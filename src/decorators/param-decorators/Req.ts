import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../abstracts";

class ReqParamDecorator extends ExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req;
    }
}

const Req = ExtensionParamDecorator.createDecorator(ReqParamDecorator);

export default Req;
