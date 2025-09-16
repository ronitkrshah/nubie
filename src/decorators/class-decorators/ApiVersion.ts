import { ControllerBase } from "../../base";

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
        const existingMetadata = Reflect.getOwnMetadata(ControllerBase.METADATA_KEY, this._target) || {};
        Reflect.defineMetadata(
            ControllerBase.METADATA_KEY,
            { ...existingMetadata, ...{ apiVersion: this._version } },
            this._target,
        );
    }
}

/**
 * Specifies the version of the API for the controller.
 *
 * Useful for versioned routing and backward compatibility.
 */
const ApiVersion = ControllerBase.createDecorator(ApiVersionDecorator);

export default ApiVersion;
