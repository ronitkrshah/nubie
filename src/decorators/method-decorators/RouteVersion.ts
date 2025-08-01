import { MethodDecorator } from "../../abstracts";
import { Logger } from "../../helpers";

class RouteVersionDecorator extends MethodDecorator {
    public constructor(public readonly version: number) {
        super();
        if (typeof version !== "number") {
            Logger.error("Version Must Be A Valid Integer");
            process.exit(1);
        }
    }

    public async executeAsync(): Promise<void> {
        this.updateMethodMetadata({ apiVersion: this.version });
    }
}

const RouteVersion = MethodDecorator.createDecorator(RouteVersionDecorator);

export default RouteVersion;
