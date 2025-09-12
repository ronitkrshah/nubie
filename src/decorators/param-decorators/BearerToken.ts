import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";
import { AppConfig } from "../../config";
import { HttpStatusCodes } from "../../core";
import { NubieError } from "../../utils";

class BearerTokenDecorator extends ParamExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const config = await AppConfig.getConfig();
        if (!config.jwtSecretKey) {
            throw new NubieError("JWT Code Not Available In Config File", HttpStatusCodes.InternalServerError);
        }

        const bearerToken = req.headers["authorization"];
        if (!bearerToken)
            throw new NubieError("Bearer token not found — bring your pass next time.", HttpStatusCodes.BadRequest);

        return bearerToken.split(" ")[1];
    }
}

const BearerToken = ParamExtensionDecorator.createDecorator(BearerTokenDecorator);

export default BearerToken;
