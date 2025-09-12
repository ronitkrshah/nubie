import { ControllerBase } from "../../base";
import { Metadata } from "../../utils";

class ApiVersionDecorator extends ControllerBase {
    private readonly _version?: number;

    public constructor(version: number) {
        super();
        if (typeof version === "number") {
            this._version = version;
        }
    }

    public async registerControllerAsync(): Promise<void> {
        if (!this._version) {
            throw new Error(`Ignoring ${this._target.name} Version Because It's Not An Number`);
        }
        Metadata.updateMetadata(ControllerBase.METADATA_KEY, this._target, { apiVersion: this._version });
    }
}

const ApiVersion = ControllerBase.createDecorator(ApiVersionDecorator);

export default ApiVersion;
