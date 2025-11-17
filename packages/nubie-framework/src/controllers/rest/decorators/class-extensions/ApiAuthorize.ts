import { RestClassExtension } from "../../abstractions";
import { THttpContext } from "../../types";
import { UnauthenticatedRequestException } from "../../exceptions";
import { SecurityConfig } from "../../../../core/config";

class ApiAuthorizeMiddleware extends RestClassExtension {
    public async handleAsync({ req, next }: THttpContext): Promise<void> {
        if (!SecurityConfig.jwtSecret) {
            throw new Error("SecurityConfig.jwtSecret isn't set");
        }

        const bearerToken = req.headers.authorization?.replace("Bearer ", "");
        if (!bearerToken) return next(new UnauthenticatedRequestException());

        try {
            const jwt = require("jsonwebtoken");
            jwt.verify(bearerToken, SecurityConfig.jwtSecret);
        } catch (error) {
            return next(new UnauthenticatedRequestException());
        }
        next();
    }
}

export const ApiAuthorize = RestClassExtension.createDecorator(ApiAuthorizeMiddleware);
