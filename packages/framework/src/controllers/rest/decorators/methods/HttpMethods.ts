import { BaseMethodDecorator } from "../../../../abstractions";
import { ObjectEditor } from "../../../../utils";
import { IRestConfig } from "../../IRestConfig";

function httpMethodFactory(method: THttpMethod) {
    return class HttpMethodDecorator extends BaseMethodDecorator<IRestConfig> {
        public constructor(public readonly route: string) {
            super();
        }

        public init(): Promise<void> | void {
            const metadata = this.getClassMetadata();
            const editor = new ObjectEditor(metadata);
            editor.mutateState((state) => {
                if (!state.requestHandlers) state.requestHandlers = {};
                const metadata = state.requestHandlers[this.propertyKey];
                if (metadata) {
                    metadata.httpMethod = method;
                    metadata.route = this.route;
                } else {
                    state.requestHandlers[this.propertyKey] = {
                        httpMethod: method,
                        route: this.route,
                    };
                }
            });
            this.updateClassMetadata(editor.getState());
        }
    };
}

const GetDecorator = httpMethodFactory("get");
export const HttpGet = BaseMethodDecorator.createDecorator(GetDecorator);

const PostDecorator = httpMethodFactory("post");
export const HttpPost = BaseMethodDecorator.createDecorator(PostDecorator);

const PutDecorator = httpMethodFactory("put");
export const HttpPut = BaseMethodDecorator.createDecorator(PutDecorator);

const PatchDecorator = httpMethodFactory("patch");
export const HttpPatch = BaseMethodDecorator.createDecorator(PatchDecorator);

const DeleteDecorator = httpMethodFactory("delete");
export const HttpDelete = BaseMethodDecorator.createDecorator(DeleteDecorator);
