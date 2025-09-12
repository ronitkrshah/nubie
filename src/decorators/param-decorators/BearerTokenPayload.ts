import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";
import { AppConfig } from "../../config";
import { HttpStatusCodes, JWTToken } from "../../core";
import { NubieError } from "../../utils";

class BearerTokenPayloadDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) {
            throw new NubieError("JWT Code Not Available In Config File", HttpStatusCodes.InternalServerError);
        }

        const bearerToken = req.headers["authorization"];
        if (!bearerToken)
            throw new NubieError("Bearer token not found — bring your pass next time.", HttpStatusCodes.BadRequest);

        try {
            return await JWTToken.verifyTokenAsync(bearerToken.split(" ")[1]);
        } catch (error) {
            throw new NubieError(
                "JWT validation failed — the lock didn’t like the key.",
                HttpStatusCodes.BadRequest,
                (error as Error).message,
            );
        }
    }
}

/**
 * Decodes and injects the payload from the bearer token.
 */
const BearerTokenPayload = ParamExtensionDecorator.createDecorator(BearerTokenPayloadDecorator);

export default BearerTokenPayload;
