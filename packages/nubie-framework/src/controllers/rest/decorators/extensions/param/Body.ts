import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";

export class BodyDecorator extends RestParamExtension {
    public async handleAsync({ req }: Omit<THttpContext, "next">): Promise<unknown> {
        return req.body;
    }
}

export const Body = RestParamExtension.createDecorator(BodyDecorator);
