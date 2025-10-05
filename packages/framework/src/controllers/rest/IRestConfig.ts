import { RestParamExtension, RestMethodExtension } from "./abstractions";
import { RestClassExtension } from "./abstractions";

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
              methodMiddlewares?: RestMethodExtension[];
              params?: { decorator: RestParamExtension; index: number }[];
              config?: {
                  useClassLevelAuthorize?: boolean;
              };
          }
        | undefined
    >;
}
