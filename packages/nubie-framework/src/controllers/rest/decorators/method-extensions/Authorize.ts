import { RestMethodExtension } from "../../abstractions";
import { THttpContext } from "../../types";
import { UnauthenticatedRequestException } from "../../exceptions";
import { SecurityConfig } from "../../../../core/config";

class AuthorizeMiddleware extends RestMethodExtension {
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

export const Authorize = RestMethodExtension.createDecorator(AuthorizeMiddleware);
