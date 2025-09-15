import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";
import { AppConfig } from "../../config";
import { HttpStatusCodes, JWTToken } from "../../core";
import { Exception } from "../../utils";
import {
    AuthorizationHeaderRequiredException,
    InvalidJwtConfigException,
    UnauthorizedAccessException,
} from "../../exceptions/authentication";

class BearerTokenPayloadDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) throw new InvalidJwtConfigException();

        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw new AuthorizationHeaderRequiredException();

        try {
            return await JWTToken.verifyTokenAsync(bearerToken.split(" ")[1]);
        } catch {
            throw new UnauthorizedAccessException();
        }
    }
}

/**
 * Decodes and injects the payload from the bearer token.
 */
const BearerTokenPayload = ParamExtensionDecorator.createDecorator(BearerTokenPayloadDecorator);

export default BearerTokenPayload;
