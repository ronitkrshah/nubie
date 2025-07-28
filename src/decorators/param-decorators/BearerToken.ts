import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";
import { NubieAppConfig } from "../../config";
import { NubieError } from "../../helpers";
import { HttpStatusCodes } from "../../core";

class BearerTokenDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await NubieAppConfig.getAppConfigAsync();
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

const BearerToken = NubieExtensionParamDecorator.createDecorator(BearerTokenDecorator);

export default BearerToken;
