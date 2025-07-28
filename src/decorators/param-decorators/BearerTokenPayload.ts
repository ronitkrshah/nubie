import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";
import { NubieAppConfig } from "../../config";
import { HttpStatusCodes, JWTToken } from "../../core";
import { NubieError } from "../../helpers";

class BearerTokenPayloadDecorator extends NubieExtensionParamDecorator {
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

        try {
            return await JWTToken.verifyTokenAsync(bearerToken.split(" ")[1]);
        } catch (error) {
            throw new NubieError("JWTValidationFailed", HttpStatusCodes.BadRequest, (error as Error).message);
        }
    }
}

const BearerTokenPayload = NubieExtensionParamDecorator.createDecorator(BearerTokenPayloadDecorator);

export default BearerTokenPayload;
