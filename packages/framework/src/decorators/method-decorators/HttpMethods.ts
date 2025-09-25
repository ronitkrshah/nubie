import type { TMethodMetadata } from "../../abstractions";
import { MethodDecorator } from "../../abstractions";

abstract class BaseHttpDecorator extends MethodDecorator {
    protected abstract httpMethod: TMethodMetadata["httpMethod"];

    constructor(protected readonly endpoint: string) {
        super();
    }

    public async executeAsync(): Promise<void> {
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
