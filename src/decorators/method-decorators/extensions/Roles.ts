import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../base";
import { JWTToken } from "../../../core";
import {
    AuthorizationHeaderRequiredException,
    InsufficientPermissionException,
} from "../../../exceptions/authentication";

class RolesDecorator extends MethodExtensionDecorator {
    private readonly _roles: string | string[];

    public constructor(roles: string | string[]) {
        super();
        this._roles = roles;
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw new AuthorizationHeaderRequiredException();

        const token = bearerToken.split(" ")[1];
        const data = await JWTToken.verifyTokenAsync(token);

        if (typeof data === "string" || !data?.role) {
            throw new InsufficientPermissionException();
        }

        if (!this._roles.includes(data.role)) {
            throw new InsufficientPermissionException();
        }
    }
}

/**
 * Restricts access to users with specific roles.
 */
const Role = MethodExtensionDecorator.createDecorator(RolesDecorator);

export default Role;
