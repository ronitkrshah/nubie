export interface IConfiguration extends Record<string, unknown> {
    port: number;
    allowedHosts: string[] | "*";
    fileUploadDirectory: string;
    controllersDirectory: string;
}
