import { Logger } from "../../helpers";
import { NubieMethodDecorator } from "../abstracts";

class RouteVersionDecorator extends NubieMethodDecorator {
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

const RouteVersion = NubieMethodDecorator.createDecorator(RouteVersionDecorator);

export default RouteVersion;
