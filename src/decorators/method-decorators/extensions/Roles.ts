import { Request, Response, NextFunction } from "express";
import { NubieExtensionMethodDecorator } from "../../abstracts";
import { JWTToken } from "../../../core";

class RolesDecorator extends NubieExtensionMethodDecorator {
    private readonly _roles: string | string[];

    public constructor(roles: string | string[]) {
        super();
        this._roles = roles;
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw Error("Missing Bearer Token");

        const token = bearerToken.split(" ")[1];
        const data = await JWTToken.verifyTokenAsync(token);

        if (typeof data === "string" || !data?.role) {
            throw new Error("You Don't Have Permission To Access Data");
        }

        if (!this._roles.includes(data.role)) {
            throw new Error("You Don't Have Permission To Access Data");
        }
    }
}

const Role = NubieExtensionMethodDecorator.createDecorator(RolesDecorator);

export default Role;
