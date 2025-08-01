import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../abstracts";
import { HttpStatusCodes } from "../../core";
import { NubieError } from "../../helpers";

export const enum QueryType {
    Optional,
    Required,
}

class QueryDecorator extends ParamExtensionDecorator {
    public constructor(
        public readonly query?: string,
        public readonly required: QueryType = QueryType.Optional,
    ) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        if (!this.query) return req.query;

        const query = req.query[this.query];
        if (this.required === QueryType.Required && !query) {
            throw new NubieError(
                "MissingRequiredParam",
                HttpStatusCodes.BadRequest,
                `Missing Required Param: ${this.query}`,
            );
        }
        return query;
    }
}

const Query = ParamExtensionDecorator.createDecorator(QueryDecorator);

export default Query;
