import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";

export class RouteParamDecorator extends RestParamExtension {
    public constructor(public readonly paramKey?: string) {
        super();
    }

    public async handleAsync(context: THttpContext): Promise<unknown> {
        return this.paramKey ? context.req.params[this.paramKey] : context.req.params;
    }
}

export const RouteParam = RestParamExtension.createDecorator(RouteParamDecorator);
