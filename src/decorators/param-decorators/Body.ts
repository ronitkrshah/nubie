import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

class BodyParamDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (req.method === "GET") {
            throw new Error("GET requests should not contain a request body. Consider using POST or PATCH.");
        }

        return req.body;
    }
}

const Body = NubieExtensionParamDecorator.createDecorator(BodyParamDecorator);

export default Body;
