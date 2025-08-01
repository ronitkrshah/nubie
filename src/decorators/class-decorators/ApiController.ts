import { Logger } from "../../helpers";
import { ClassDecorator } from "../abstracts";

class ApiControllerDecorator extends ClassDecorator {
    private _endpoint: string;

    public constructor(endpoint = "[controller]") {
        super();
        this._endpoint = endpoint;
    }

    private isValidController() {
        if (!this._target.name.endsWith("Controller")) {
            return false;
        }

        return true;
    }

    private configureEndpoint() {
        if (this._endpoint === "[controller]") {
            this._endpoint = this._target.name.replace("Controller", "").toLowerCase();
        }
    }

    public async executeAsync(): Promise<void> {
        if (!this.isValidController()) {
            return Logger.error(`Ignoring ${this._target.name}. Because It Doesn't Match Nubie Naming Convention`);
        }
        this.configureEndpoint();
        ClassDecorator.updateMetadata(this._target, { endpoint: this._endpoint, className: this._target.name });
    }
}

const ApiController = ClassDecorator.createDecorator(ApiControllerDecorator);

export default ApiController;
