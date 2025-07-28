import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";
import { NubieAppConfig } from "../../config";
import { JWTToken } from "../../core";

class BearerTokenPayloadDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await NubieAppConfig.getAppConfigAsync();
        if (!config.jwtSeceretKey) throw new Error("No JWT Secret Defined In Nubie.json");

        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw Error("Missing Bearer Token");

        return await JWTToken.verifyTokenAsync(bearerToken.split(" ")[1]);
    }
}

const BearerTokenPayload = NubieExtensionParamDecorator.createDecorator(BearerTokenPayloadDecorator);

export default BearerTokenPayload;
