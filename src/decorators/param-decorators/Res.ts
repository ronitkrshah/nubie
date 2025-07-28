import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class ResParamDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return res;
    }
}

const Res = NubieExtensionParamDecorator.createDecorator(ResParamDecorator);

export default Res;
