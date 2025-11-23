import { RestParamExtension } from "../../abstractions";
import { THttpContext } from "../../types";

export class RequestDecorator extends RestParamExtension {
    public async invokeAsync({ req }: Omit<THttpContext, "next">): Promise<unknown> {
        return req;
    }
}

export const Request = RestParamExtension.createDecorator(RequestDecorator);
