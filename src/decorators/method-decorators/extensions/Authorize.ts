import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../base";
import { JWTToken } from "../../../core";
import { AuthorizationHeaderRequiredException, UnauthorizedAccessException } from "../../../exceptions/authentication";

class AuthorizeDecorator extends MethodExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];

        if (!bearerToken) throw new AuthorizationHeaderRequiredException();

        try {
            const payload = await JWTToken.verifyTokenAsync(bearerToken.split(" ")[1]);
            if (typeof payload === "string") throw new UnauthorizedAccessException();
            req.user = payload;
        } catch (error) {
            throw new UnauthorizedAccessException();
        }
    }
}

/**
 * Applies authorization logic to a controller method.
 *
 * Ensures that the request is authenticated and optionally checks roles or permissions.
 */
const Authorize = MethodExtensionDecorator.createDecorator(AuthorizeDecorator);

export default Authorize;
