import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstracts";

class ParamDecorator extends ParamExtensionDecorator {
    public constructor(public readonly param?: string) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (this.param) return req.params[this.param];
        return req.params;
    }
}

const Param = ParamExtensionDecorator.createDecorator(ParamDecorator);

export default Param;
