import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";
import { NubieAppConfig } from "../../config";

class BearerTokenDecorator extends NubieExtensionParamDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await NubieAppConfig.getAppConfigAsync();
        if (!config.jwtSeceretKey) throw new Error("No JWT Secret Defined In Nubie.json");

        const bearerToken = req.headers["authorization"];
        if (!bearerToken) throw Error("Missing Bearer Token");

        return bearerToken.split(" ")[1];
    }
}

const BearerToken = NubieExtensionParamDecorator.createDecorator(BearerTokenDecorator);

export default BearerToken;
