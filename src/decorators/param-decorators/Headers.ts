import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../../abstracts";

class HeadersParamDecorator extends ExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.headers;
    }
}

const Headers = ExtensionParamDecorator.createDecorator(HeadersParamDecorator);

export default Headers;
