import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";
import { HttpStatusCodes } from "../../core";
import { NubieError } from "../../utils";

class BodyParamDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (req.method === "GET") {
            throw new NubieError(
                "GET requests shouldn’t carry a body — consider POST or PATCH instead.",
                HttpStatusCodes.BadRequest,
            );
        }

        return req.body;
    }
}

/**
 * Injects the parsed request body into the method parameter.
 */
const Body = ParamExtensionDecorator.createDecorator(BodyParamDecorator);

export default Body;
