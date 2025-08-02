import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstracts";
import { AppConfiguration } from "../../config";
import { HttpStatusCodes } from "../../core";
import { NubieError } from "../../helpers";

class BearerTokenDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await AppConfiguration.getAppConfigAsync();
        if (!config.jwtSecretKey) {
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

const BearerToken = ParamExtensionDecorator.createDecorator(BearerTokenDecorator);

export default BearerToken;
