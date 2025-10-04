import { RestMethodMiddleware } from "../../abstractions";
import { THttpContext } from "../../types";

class AuthorizeMiddleware extends RestMethodMiddleware {
    public async handleAsync({ req, next }: THttpContext): Promise<void> {
        console.log("Authorize:", req.headers.authorization);
        next();
    }
}

export const Authorize = RestMethodMiddleware.createDecorator(AuthorizeMiddleware);
