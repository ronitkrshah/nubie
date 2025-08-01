import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../abstracts";

class ResParamDecorator extends ExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return res;
    }
}

const Res = ExtensionParamDecorator.createDecorator(ResParamDecorator);

export default Res;
