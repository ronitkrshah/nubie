export interface IRestConfig {
    apiVersion?: number;
    baseEndpoint: string;
    className: string;
    requestHandlers?: Record<
        string,
        | {
              httpMethod: THttpMethod;
              route: string;
              apiVersion?: number;
          }
        | undefined
    >;
}
