import { Request, Response, NextFunction } from "express";
import { ParamExtensionDecorator } from "../../base";
import { HttpStatusCodes } from "../../core";
import { NubieError } from "../../utils";

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
                "Missing required parameter — a puzzle piece is missing.",
                HttpStatusCodes.BadRequest,
                `Missing Required Param: ${this.query}`,
            );
        }
        return query;
    }
}

const Query = ParamExtensionDecorator.createDecorator(QueryDecorator);

export default Query;
