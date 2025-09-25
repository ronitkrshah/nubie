import type { Request } from "express";
import { ParamExtensionDecorator } from "../../abstractions/decorator-extensions";
import { MissingParameterException } from "../../exceptions/req";

export const enum QueryType {
    Optional,
    Required,
}

class QueryParamDecorator extends ParamExtensionDecorator {
    public constructor(
        public readonly query?: string,
        public readonly required: QueryType = QueryType.Optional,
    ) {
        super();
    }

    public async executeAsync(req: Request): Promise<unknown> {
        if (!this.query) return req.query;

        const query = req.query[this.query];
        if (this.required === QueryType.Required && !query) {
            throw new MissingParameterException(this.query);
        }
        return query;
    }
}

/**
 * Injects a query parameter by name.
 */
const QueryParam = ParamExtensionDecorator.createDecorator(QueryParamDecorator);

export default QueryParam;
