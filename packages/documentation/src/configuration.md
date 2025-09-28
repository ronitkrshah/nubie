# Configuration

Nubie supports simple, centralized configuration through a `nubie.config.js` file at the root of your project.
Use it to control your app’s behavior without diving into code.

```ts
interface IConfiguration {
    Port: number; // Default: 8080
    HttpRequest: {
        DefaultApiVersion: number; // Default: 1
        MaxBodySize?: string | number; // Default: 100kb
    };
    Mappings: {
        ControllerDirectory: string; // Default: Controllers
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
```

## Example

```json
{
    "Port": 5173,
    "HttpRequest": {
        "DefaultApiVersion": 2
    }
}
```
