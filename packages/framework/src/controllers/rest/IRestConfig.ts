import { RestParamExtension, RestMethodExtension } from "./abstractions";
import { RestClassExtension } from "./abstractions";
import { RequestHandler } from "express";

export interface IRestConfig {
    apiVersion?: number;
    baseEndpoint: string;
    className: string;
    classMiddlewares?: RestClassExtension[];
    requestHandlers?: Record<
        string,
        | {
              httpMethod: THttpMethod;
              route: string;
              apiVersion?: number;
              // framework level custom with extension class
              methodMiddlewares?: RestMethodExtension[];
              // native express
              nativeMiddlewares?: RequestHandler[];
              params?: { decorator: RestParamExtension; index: number }[];
              config?: {
                  useClassLevelAuthorize?: boolean;
              };
          }
        | undefined
    >;
}
