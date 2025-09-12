import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";

class HeadersParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.headers;
    }
}

const Headers = ParamExtensionDecorator.createDecorator(HeadersParamDecorator);

export default Headers;
