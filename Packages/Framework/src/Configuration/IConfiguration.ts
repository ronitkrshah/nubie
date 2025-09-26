export interface IConfiguration {
    Port: number;
    HttpRequest: {
        DefaultApiVersion: number;
        MaxBodySize?: string | number;
    };
    Mappings: {
        ControllerDirectory: string;
    };
    Authentication?: {
        SecretKey?: string;
        AccessTokenTimeout?: number;
        RefreshTokenTimeout?: number;
    };
    Hosts?: {
        AllowedHosts?: Array<string>;
    };
}
