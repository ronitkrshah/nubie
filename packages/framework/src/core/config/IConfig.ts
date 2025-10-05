export interface IConfig {
    http: {
        port: number;
        defaultApiVersion: number;
    };
    authentication?: {
        secretKey?: string;
    };
    mappings: {
        controllersDirectory: string;
    };
}
