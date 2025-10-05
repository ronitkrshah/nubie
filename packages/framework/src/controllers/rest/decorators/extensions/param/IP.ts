import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";

export class IPDecorator extends RestParamExtension {
    public async handleAsync({ req }: Omit<THttpContext, "next">): Promise<unknown> {
        return req.ip;
    }
}

export const IP = RestParamExtension.createDecorator(IPDecorator);
