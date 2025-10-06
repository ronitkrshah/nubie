import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";

export class ResponseDecorator extends RestParamExtension {
    public async handleAsync({ res }: Omit<THttpContext, "next">): Promise<unknown> {
        return res;
    }
}

export const Response = RestParamExtension.createDecorator(ResponseDecorator);
