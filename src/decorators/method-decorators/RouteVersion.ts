import { Logger } from "../../helpers";
import { NubieMethodDecorator } from "../helpers";

class RouteVersionDecorator extends NubieMethodDecorator {
    public constructor(private readonly _version: number) {
        super();
        if (typeof _version !== "number") {
            Logger.error("Version Must Be A Valid Integer");
            process.exit(1);
        }
    }

    public async executeAsync(): Promise<void> {
        this.updateMethodMetadata({ apiVersion: this._version });
    }
}

const RouteVersion = NubieMethodDecorator.createDecorator(RouteVersionDecorator);

export default RouteVersion;
