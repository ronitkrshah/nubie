import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../abstracts";
import { AppConfiguration } from "../../config";
import { NubieError } from "../../helpers";
import { HttpStatusCodes } from "../../core";

class BearerTokenDecorator extends ExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await AppConfiguration.getAppConfigAsync();
        if (!config.jwtSeceretKey) {
            throw new NubieError("JWT Code Not Available In Config File", HttpStatusCodes.InternalServerError);
        }

        const bearerToken = req.headers["authorization"];
        if (!bearerToken)
            throw new NubieError(
                "MissingBearerToken",
                HttpStatusCodes.BadRequest,
                "Request Header Must Contain A Valid Bearer Token",
            );

        return bearerToken.split(" ")[1];
    }
}

const BearerToken = ExtensionParamDecorator.createDecorator(BearerTokenDecorator);

export default BearerToken;
