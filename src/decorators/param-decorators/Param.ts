import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class ParamDecorator extends NubieExtensionParamDecorator {
    public constructor(public readonly param?: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (this.param) return req.params[this.param];
        return req.params;
    }
}

const Param = NubieExtensionParamDecorator.createDecorator(ParamDecorator);

export default Param;
