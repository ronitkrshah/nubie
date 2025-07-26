import { Logger } from "../../helpers";
import { NubieClassDecorator } from "../abstracts";

class ApiControllerDecorator extends NubieClassDecorator {
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
        this.updateMetadata({ endpoint: this._endpoint, className: this._target.name });
    }
}

const ApiController = NubieClassDecorator.createDecorator(ApiControllerDecorator);

export default ApiController;
