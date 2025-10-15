import { BaseClassDecorator } from "../../../../abstractions";
import { InvalidControllerNameException } from "../../exceptions";
import { ObjectEditor } from "../../../../utils";
import { IRestMetadata } from "../../IRestMetadata";
import { RestRequestBuilder } from "../../builder";
import { GlobalContainer } from "@nubie/di";
import { HttpApp } from "../../../../HttpApp";

class RestControllerDecorator extends BaseClassDecorator {
    private _endpoint: string;

    public constructor(endpoint: string = "{controller}") {
        super();
        this._endpoint = endpoint;
    }

    private validateClass() {
        const className = this.target.name;
        if (!className.endsWith("Controller")) throw new InvalidControllerNameException();
        this._endpoint = this._endpoint.replace(
            "{controller}",
            className.replace("Controller", "").toLowerCase(),
        );
    }

    private updateMetadata() {
        const metadata: IRestMetadata =
            Reflect.getOwnMetadata(BaseClassDecorator.MetadataKey, this.target) || {};

        const editor = new ObjectEditor<IRestMetadata>(metadata);
        editor.mutateState((state) => {
            state.className = this.target.name;
            state.baseEndpoint = this._endpoint;
        });
        Reflect.defineMetadata(BaseClassDecorator.MetadataKey, editor.getState(), this.target);
    }

    public async init(): Promise<void> {
        this.validateClass();
        this.updateMetadata();
        const requestBuilder = new RestRequestBuilder(this);
        await requestBuilder.buildAsync();
        const httpApp = GlobalContainer.resolveInstance<HttpApp>(HttpApp.Token);
        httpApp.express.use(requestBuilder.router);
    }
}

export const RestController = BaseClassDecorator.createDecorator(RestControllerDecorator);
