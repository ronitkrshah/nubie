import { RestParamExtension } from "../../abstractions";
import { THttpContext } from "../../types";

export class IPDecorator extends RestParamExtension {
    public async invokeAsync({ req }: Omit<THttpContext, "next">): Promise<unknown> {
        return req.ip;
    }
}

export const IP = RestParamExtension.createDecorator(IPDecorator);
