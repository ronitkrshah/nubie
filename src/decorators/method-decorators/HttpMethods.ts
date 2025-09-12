import { MethodDecorator, TMethodMetadata } from "../../base";

type TFunctionType = "AsyncFunction" | "Function";

abstract class BaseHttpDecorator extends MethodDecorator {
    protected abstract httpMethod: TMethodMetadata["httpMethod"];

    constructor(protected readonly endpoint: string) {
        super();
    }

    private validateMethodName() {
        const funcType = this._descriptor.value.constructor.name as TFunctionType;
        const isAsyncSuffix = this._methodName.endsWith("Async");

        if (funcType !== "AsyncFunction") {
            throw new Error("Methods Must Be An Async Function :: " + this._methodName);
        }

        if (!isAsyncSuffix) {
            throw new Error("Controller Methods Must End With Async Keyword :: " + this._methodName);
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

/**
 * Maps an HTTP GET request to the decorated method.
 */
export const HttpGet = MethodDecorator.createDecorator(HttpGetDecorator);

/**
 * Maps an HTTP POST request to the decorated method.
 */
export const HttpPost = MethodDecorator.createDecorator(HttpPostDecorator);

/**
 * Maps an HTTP PUT request to the decorated method.
 */
export const HttpPut = MethodDecorator.createDecorator(HttpPutDecorator);

/**
 * Maps an HTTP PATCH request to the decorated method.
 */
export const HttpPatch = MethodDecorator.createDecorator(HttpPatchDecorator);

/**
 * Maps an HTTP DELETE request to the decorated method.
 */
export const HttpDelete = MethodDecorator.createDecorator(HttpDeleteDecorator);
