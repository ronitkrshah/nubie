import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class ParamDecorator extends NubieExtensionParamDecorator {
    public constructor(public readonly param: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.params[this.param];
    }
}

const Param = NubieExtensionParamDecorator.createDecorator(ParamDecorator);

export default Param;
