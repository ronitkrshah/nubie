import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";

export class HeadersDecorator extends RestParamExtension {
    public async handleAsync({ req }: Omit<THttpContext, "next">): Promise<unknown> {
        return req.headers;
    }
}

export const Headers = RestParamExtension.createDecorator(HeadersDecorator);
