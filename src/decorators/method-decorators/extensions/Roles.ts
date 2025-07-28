import { Request, Response, NextFunction } from "express";
import { NubieExtensionMethodDecorator } from "../../abstracts";
import { HttpStatusCodes, JWTToken } from "../../../core";
import { NubieError } from "../../../helpers";

class RolesDecorator extends NubieExtensionMethodDecorator {
    private readonly _roles: string | string[];

    public constructor(roles: string | string[]) {
        super();
        this._roles = roles;
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];
        if (!bearerToken)
            throw new NubieError(
                "MissingBearerToken",
                HttpStatusCodes.BadRequest,
                "Request Header Must Contain A Valid Bearer Token",
            );

        const token = bearerToken.split(" ")[1];
        const data = await JWTToken.verifyTokenAsync(token);

        if (typeof data === "string" || !data?.role) {
            throw new NubieError(
                "Unauthorized",
                HttpStatusCodes.Unauthorized,
                "You Don't Have Access For Requested Data",
            );
        }

        if (!this._roles.includes(data.role)) {
            throw new NubieError(
                "Unauthorized",
                HttpStatusCodes.Unauthorized,
                "You Don't Have Access For Requested Data",
            );
        }
    }
}

const Role = NubieExtensionMethodDecorator.createDecorator(RolesDecorator);

export default Role;
