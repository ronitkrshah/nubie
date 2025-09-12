import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";

class ResParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return res;
    }
}

const Res = ParamExtensionDecorator.createDecorator(ResParamDecorator);

export default Res;
