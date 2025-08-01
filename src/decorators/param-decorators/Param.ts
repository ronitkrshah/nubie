import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../abstracts";

class ParamDecorator extends ExtensionParamDecorator {
    public constructor(public readonly param?: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (this.param) return req.params[this.param];
        return req.params;
    }
}

const Param = ExtensionParamDecorator.createDecorator(ParamDecorator);

export default Param;
