import { Request, Response, NextFunction } from "express";
import { NubieExtensionMethodDecorator } from "../abstracts";
import { NubieAppConfig } from "../../config";
import jwt from "jsonwebtoken";

class JWTAuthDecorator extends NubieExtensionMethodDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const config = await NubieAppConfig.getAppConfigAsync();
        if (!config.jwtSeceretKey) throw new Error("No JWT Secret Defined In Nubie.json");

        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw Error("Missing Bearer Token");

        const token = bearerToken.split(" ")[1];
        jwt.verify(token, config.jwtSeceretKey);
    }
}

const JWTAuth = NubieExtensionMethodDecorator.createDecorator(JWTAuthDecorator);

export default JWTAuth;
