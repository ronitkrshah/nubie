# Configuration

Nubie supports simple, centralized configuration through a`Nubie.json` file at the root of your project.
Use it to control your app’s behavior without diving into code.

| Option               | Type     | Default     | Optional | Description                                                                                           |
| -------------------- | -------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------- |
| port                 | `int`    | 8080        | No       | The port your application will listen on when the server starts.                                      |
| defaultApiVersion    | `int`    | 1           | No       | Sets the default API version for route prefixing. Useful for versioned APIs like `/api/v1`.           |
| controllersDirectory | `string` | controllers | No       | Folder where your controller files are located.                                                       |
| jwtSecretKey         | `string` | undefined   | Yes      | Secret key used to verify and sign JWT tokens. Required if you’re using auth decorator `@Authorize()` |

## Example

```json
{
  "port": 8080,
  "defaultApiVersion": 1,
  "controllersDirectory": "controllers",
  "jwtSecretKey": "my-super-secret-key-for-auth"
}
```
