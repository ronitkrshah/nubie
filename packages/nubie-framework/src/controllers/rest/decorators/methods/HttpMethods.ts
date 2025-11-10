import { BaseMethodDecorator } from "../../../../abstractions";
import { ObjectEditor } from "../../../../utils";
import { IRestMetadata } from "../../IRestMetadata";

function httpMethodFactory(method: THttpMethod) {
    return class HttpMethodDecorator extends BaseMethodDecorator<IRestMetadata> {
        public constructor(public readonly route: string) {
            super();
        }

        public init(): Promise<void> | void {
            const metadata = this.getClassMetadata();
            const editor = new ObjectEditor(metadata);
            editor.mutateState((state) => {
                // @ts-ignore
                (state.requestHandlers ??= {})[this.propertyKey] ??= {};
                // @ts-ignore
                state.requestHandlers[this.propertyKey].httpMethod = method;
                // @ts-ignore
                state.requestHandlers[this.propertyKey].route = this.route;
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
