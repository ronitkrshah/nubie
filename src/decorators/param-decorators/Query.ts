import { Request, Response, NextFunction } from "express";
import { ExtensionParamDecorator } from "../abstracts";
import { NubieError } from "~/helpers";
import { HttpStatusCodes } from "~/core";

export const enum QueryType {
    Optional,
    Required,
}

class QueryDecorator extends ExtensionParamDecorator {
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

const Query = ExtensionParamDecorator.createDecorator(QueryDecorator);

export default Query;
