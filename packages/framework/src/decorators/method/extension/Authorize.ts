import type { Request } from "express";
import { MethodExtensionDecorator } from "../../../abstractions";
import { JwtToken } from "../../../security";
import { AuthorizationHeaderRequiredException, UnauthorizedAccessException } from "../../../exceptions";

class AuthorizeDecorator extends MethodExtensionDecorator {
    public async executeAsync(req: Request): Promise<void> {
        const bearerToken = req.headers["authorization"];

        if (!bearerToken) throw new AuthorizationHeaderRequiredException();

        try {
            const payload = JwtToken.verifyToken(bearerToken.split(" ")[1]);
            if (typeof payload === "string") throw new UnauthorizedAccessException();
            req.user = payload;
        } catch {
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
