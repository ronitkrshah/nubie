import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstracts";
import { HttpStatusCodes } from "../../core";
import { NubieError } from "../../helpers";

class BodyParamDecorator extends ParamExtensionDecorator {
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

const Body = ParamExtensionDecorator.createDecorator(BodyParamDecorator);

export default Body;
