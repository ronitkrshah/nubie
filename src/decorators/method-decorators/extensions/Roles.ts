import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../base";
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
        const user = req.user;
        if (!req.user) throw new AuthorizationHeaderRequiredException();
        if (!user?.role) throw new InsufficientPermissionException();
        if (!this._roles.includes(user.role)) throw new InsufficientPermissionException();
    }
}

/**
 * Restricts access to users with specific roles.
 */
const Role = MethodExtensionDecorator.createDecorator(RolesDecorator);

export default Role;
