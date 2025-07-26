import { Logger } from "../../helpers";
import { NubieMethodDecorator, TMethodMetadata } from "../abstracts";

type TFunctionType = "AsyncFunction" | "Function";

abstract class BaseHttpDecorator extends NubieMethodDecorator {
    protected abstract httpMethod: TMethodMetadata["httpMethod"];

    constructor(protected readonly endpoint: string) {
        super();
    }

    private validateMethodName() {
        const funcType = this._descriptor.value.constructor.name as TFunctionType;
        const isAsyncSuffix = this._methodName.endsWith("Async");

        if (funcType !== "AsyncFunction") {
            Logger.error("Methods Must Be An Async Function :: " + this._methodName);
            process.exit(1);
        }

        if (!isAsyncSuffix) {
            Logger.error("Controller Methods Must End With Async Keyword :: " + this._methodName);
            process.exit(1);
        }
    }

    public async executeAsync(): Promise<void> {
        this.validateMethodName();
        this.updateMethodMetadata({
            endpoint: this.endpoint,
            httpMethod: this.httpMethod,
        });
    }
}

class HttpGetDecorator extends BaseHttpDecorator {
    protected httpMethod: "get" | "post" | "put" | "patch" | "delete" = "get";
}
class HttpPostDecorator extends BaseHttpDecorator {
    protected httpMethod: "get" | "post" | "put" | "patch" | "delete" = "post";
}
class HttpPutDecorator extends BaseHttpDecorator {
    protected httpMethod: "get" | "post" | "put" | "patch" | "delete" = "put";
}
class HttpPatchDecorator extends BaseHttpDecorator {
    protected httpMethod: "get" | "post" | "put" | "patch" | "delete" = "patch";
}
class HttpDeleteDecorator extends BaseHttpDecorator {
    protected httpMethod: "get" | "post" | "put" | "patch" | "delete" = "delete";
}

export const HttpGet = NubieMethodDecorator.createDecorator(HttpGetDecorator);
export const HttpPost = NubieMethodDecorator.createDecorator(HttpPostDecorator);
export const HttpPut = NubieMethodDecorator.createDecorator(HttpPutDecorator);
export const HttpPatch = NubieMethodDecorator.createDecorator(HttpPatchDecorator);
export const HttpDelete = NubieMethodDecorator.createDecorator(HttpDeleteDecorator);
