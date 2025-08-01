import { Logger } from "~/helpers";
import { ClassDecorator } from "../abstracts";

class ApiVersionDecorator extends ClassDecorator {
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

        ClassDecorator.updateMetadata(this._target, { apiVersion: this._version });
    }
}

const ApiVersion = ClassDecorator.createDecorator(ApiVersionDecorator);

export default ApiVersion;
