export interface INubieConfig {
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
