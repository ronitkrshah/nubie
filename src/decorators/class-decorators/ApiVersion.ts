import { Logger } from "../../helpers";
import { NubieClassDecorator } from "../abstracts";

class ApiVersionDecorator extends NubieClassDecorator {
    private readonly _version?: number;

    public constructor(version: number) {
        super();
        if (typeof version === "number") {
            this._version = version;
        }
    }

    public async executeAsync(): Promise<void> {
        if (!this._version) {
            Logger.error(`Ignoring ${this._target.name} Version Because It's Not An Number`);
            return;
        }

        NubieClassDecorator.updateMetadata(this._target, { apiVersion: this._version });
    }
}

const ApiVersion = NubieClassDecorator.createDecorator(ApiVersionDecorator);

export default ApiVersion;
