import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../helpers";

class ResParamDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req;
    }
}

const Res = NubieExtensionParamDecorator.createDecorator(ResParamDecorator);

export default Res;
