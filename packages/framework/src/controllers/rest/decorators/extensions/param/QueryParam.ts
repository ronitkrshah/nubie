import { RestParamExtension } from "../../../abstractions";
import { THttpContext } from "../../../types";
import { MissingRequiredQueryException } from "../../../exceptions";

export const enum QueryMode {
    Required,
    Optional,
}

export class QueryParamDecorator extends RestParamExtension {
    public constructor(
        public readonly queryKey?: string,
        public readonly queryMode: QueryMode = QueryMode.Required,
    ) {
        super();
    }

    public async handleAsync({ req }: THttpContext): Promise<unknown> {
        if (!this.queryKey) return req.query;
        const query = req.query[this.queryKey];
        if (this.queryMode === QueryMode.Required && !query) {
            throw new MissingRequiredQueryException(this.queryKey);
        }
        return this.queryKey ? req.query[this.queryKey] : req.query;
    }
}

export const QueryParam = RestParamExtension.createDecorator(QueryParamDecorator);
