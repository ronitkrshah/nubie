import { Request, Response, NextFunction } from "express";
import { MethodExtensionDecorator } from "../../../abstracts";
import { HttpStatusCodes, JWTToken } from "../../../core";
import { NubieError } from "../../../helpers";

class AuthenticationDecorator extends MethodExtensionDecorator {
    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<void> {
        const bearerToken = req.headers["authorization"];
        if (!bearerToken)
            throw new NubieError(
                "MissingBearerToken",
                HttpStatusCodes.BadRequest,
                "Request Header Must Contain A Valid Bearer Token",
            );

        try {
            await JWTToken.verifyTokenAsync(bearerToken.split(" ")[1]);
        } catch (error) {
            throw new NubieError("JWTValidationFailed", HttpStatusCodes.BadRequest, (error as Error).message);
        }
    }
}

const Authentication = MethodExtensionDecorator.createDecorator(AuthenticationDecorator);

export default Authentication;
