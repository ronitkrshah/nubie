import { MethodDecorator } from "../../base";

class RouteVersionDecorator extends MethodDecorator {
    public constructor(public readonly version: number) {
        super();
        if (typeof version !== "number") {
            throw new Error("Version Must Be A Valid Integer");
        }
    }

    public async executeAsync(): Promise<void> {
        this.updateMethodMetadata({ apiVersion: this.version });
    }
}

/**
 * Overrides the default route version for a specific method.
 *
 * Useful when a method needs to respond to a different API version than its controller.
 */
const RouteVersion = MethodDecorator.createDecorator(RouteVersionDecorator);

export default RouteVersion;
