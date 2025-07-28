import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";
import { NubieError } from "../../helpers";
import { HttpStatusCodes } from "../../core";

class BodyParamDecorator extends NubieExtensionParamDecorator {
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

const Body = NubieExtensionParamDecorator.createDecorator(BodyParamDecorator);

export default Body;
