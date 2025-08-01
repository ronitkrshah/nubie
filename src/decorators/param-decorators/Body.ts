import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../../abstracts";
import { HttpStatusCodes } from "../../core";
import { NubieError } from "../../helpers";

class BodyParamDecorator extends ExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (req.method === "GET") {
            throw new NubieError(
                "GET requests should not contain a request body. Consider using POST or PATCH.",
                HttpStatusCodes.BadRequest,
            );
        }

        return req.body;
    }
}

const Body = ExtensionParamDecorator.createDecorator(BodyParamDecorator);

export default Body;
