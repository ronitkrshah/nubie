import { RestClassExtension, RestMethodExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";
import { UnauthenticatedRequestException } from "../../../exceptions";
import { JwtToken } from "../../../../../core/security/jwt";

class ApiAuthorizeMiddleware extends RestClassExtension {
    public async handleAsync({ req, next }: THttpContext): Promise<void> {
        const bearerToken = req.headers.authorization?.replace("Bearer ", "");
        if (!bearerToken) return next(new UnauthenticatedRequestException());

        try {
            JwtToken.verifyToken(bearerToken);
        } catch (error) {
            return next(new UnauthenticatedRequestException());
        }
        next();
    }
}

export const ApiAuthorize = RestClassExtension.createDecorator(ApiAuthorizeMiddleware);
