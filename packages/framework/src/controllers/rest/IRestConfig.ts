import { RestMethodMiddleware } from "./abstractions";
import { RestClassMiddleware } from "./abstractions";

export interface IRestConfig {
    apiVersion?: number;
    baseEndpoint: string;
    className: string;
    classMiddlewares?: RestClassMiddleware[];
    requestHandlers?: Record<
        string,
        | {
              httpMethod: THttpMethod;
              route: string;
              apiVersion?: number;
              methodMiddlewares?: RestMethodMiddleware[];
          }
        | undefined
    >;
}
