import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../helpers";

class BodyParamDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        return req.body;
    }
}

const Body = NubieExtensionParamDecorator.createDecorator(BodyParamDecorator);

export default Body;
