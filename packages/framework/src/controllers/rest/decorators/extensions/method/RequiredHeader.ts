import { RestMethodExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";
import { UnauthenticatedRequestException } from "../../../exceptions";

class RequiredHeaderDecorator extends RestMethodExtension {
    public constructor(public readonly header: string) {
        super();
    }

    public async handleAsync({ req, next }: THttpContext): Promise<void> {
        if (!req.headers[this.header]) return next(new UnauthenticatedRequestException());
        next();
    }
}

export const RequiredHeader = RestMethodExtension.createDecorator(RequiredHeaderDecorator);
