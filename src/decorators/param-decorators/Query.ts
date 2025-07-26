import { Request, Response, NextFunction } from "express";
import { NubieExtensionParamDecorator } from "../abstracts";

export const enum QueryType {
    Optional,
    Required,
}

class QueryDecorator extends NubieExtensionParamDecorator {
    public constructor(
        public readonly query: string,
        public readonly required: QueryType = QueryType.Optional,
    ) {
        super();
    }

    public async executeAsync(req: Request, res: Response, next: NextFunction): Promise<unknown> {
        const query = req.query[this.query];
        if (this.required === QueryType.Required && !query) {
            throw new Error("Required QueryParam: " + this.query);
        }
        return query;
    }
}

const Query = NubieExtensionParamDecorator.createDecorator(QueryDecorator);

export default Query;
