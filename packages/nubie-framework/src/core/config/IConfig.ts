export interface IConfig {
    http: {
        port: number;
        defaultApiVersion: number;
        useApiVersioning: boolean;
    };
    authentication?: {
        secretKey?: string;
    };
    mappings: {
        controllersDirectory: string;
    };
    cors: {
        allowedOrigins: string[] | "*";
    };
}
