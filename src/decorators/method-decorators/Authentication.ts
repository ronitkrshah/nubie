import { Request, Response, NextFunction } from "express";
import { NubieExtensionMethodDecorator } from "../abstracts";
import { JWTToken } from "../../core";

class AuthenticationDecorator extends NubieExtensionMethodDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw Error("Missing Bearer Token");

        const token = bearerToken.split(" ")[1];
        await JWTToken.verifyTokenAsync(token);
    }
}

const Authentication = NubieExtensionMethodDecorator.createDecorator(AuthenticationDecorator);

export default Authentication;
