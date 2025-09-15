import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";
import { AppConfig } from "../../config";
import { HttpStatusCodes } from "../../core";
import { Exception } from "../../utils";
import { AuthorizationHeaderRequiredException, InvalidJwtConfigException } from "../../exceptions/authentication";

class BearerTokenDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) throw new InvalidJwtConfigException();

        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw new AuthorizationHeaderRequiredException();

        return bearerToken.split(" ")[1];
    }
}

/**
 * Extracts the bearer token from the Authorization header.
 */
const BearerToken = ParamExtensionDecorator.createDecorator(BearerTokenDecorator);

export default BearerToken;
