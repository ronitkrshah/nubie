export interface IConfig {
    port: number
    defaultApiVersion: number
    controllersDirectory: string,
    jwtSecretKey?: string
}