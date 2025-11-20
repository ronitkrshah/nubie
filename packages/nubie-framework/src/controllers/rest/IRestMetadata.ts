import { RestParamExtension } from "./abstractions";
import { RequestHandler } from "express";

export interface IRestMetadata {
    baseEndpoint: string;
    className: string;
    middlewares?: RequestHandler[];
    requestHandlers?: Record<
        string,
        | {
              httpMethod: THttpMethod;
              route: string;
              apiVersion?: number;
              middlewares?: RequestHandler[];
              params?: { decorator: RestParamExtension; index: number }[];
          }
        | undefined
    >;
}
