import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class HeadersParamDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.headers;
    }
}

const Headers = NubieExtensionParamDecorator.createDecorator(HeadersParamDecorator);

export default Headers;
