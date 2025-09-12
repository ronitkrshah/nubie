import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../base";
import { HttpStatusCodes, JWTToken } from "../../../core";
import { NubieError } from "../../../utils";

class RolesDecorator extends MethodExtensionDecorator {
    private readonly _roles: string | string[];

    public constructor(roles: string | string[]) {
        super();
        this._roles = roles;
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];
        if (!bearerToken)
            throw new NubieError("Bearer token not found — bring your pass next time.", HttpStatusCodes.BadRequest);

        const token = bearerToken.split(" ")[1];
        const data = await JWTToken.verifyTokenAsync(token);

        if (typeof data === "string" || !data?.role) {
            throw new NubieError(
                "You don’t have access to this resource — gatekeeper says no.",
                HttpStatusCodes.Unauthorized,
            );
        }

        if (!this._roles.includes(data.role)) {
            throw new NubieError(
                "You don’t have access to this resource — gatekeeper says no.",
                HttpStatusCodes.Unauthorized,
            );
        }
    }
}

/**
 * Restricts access to users with specific roles.
 */
const Role = MethodExtensionDecorator.createDecorator(RolesDecorator);

export default Role;
