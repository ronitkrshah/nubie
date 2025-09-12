import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../base";
import { HttpStatusCodes, JWTToken } from "../../../core";
import { NubieError } from "../../../utils";

class AuthorizeDecorator extends MethodExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];

        if (!bearerToken)
            throw new NubieError("Bearer token not found — bring your pass next time.", HttpStatusCodes.BadRequest);

        try {
            await JWTToken.verifyTokenAsync(bearerToken.split(" ")[1]);
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
 * Applies authorization logic to a controller method.
 *
 * Ensures that the request is authenticated and optionally checks roles or permissions.
 */
const Authorize = MethodExtensionDecorator.createDecorator(AuthorizeDecorator);

export default Authorize;
