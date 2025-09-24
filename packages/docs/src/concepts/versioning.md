# Versioning

Nubie provides two decorators to manage API versioning: `@ApiVersion()` and `@RouteVersion()`.  
Both accept a **number** representing the version, but they differ in scope and application.  
If no version is specified, the **default version is `1`**.

## `@ApiVersion()`

Applies a version **globally** to all routes within a controller.

```ts
import { ApiController, ApiVersion, HttpGet, HttpResponse } from "nubie";

@ApiController()
@ApiVersion(2)
class AuthController {
  @HttpGet("status")
  public async getStatusAsync() {
    return HttpResponse.Ok({ version: 2, status: "OK" });
  }
}
```

> Effect: All routes in AuthController will be served under version 2.

## `@RouteVersion()`

Applies versioning to a specific route, allowing fine‑grained control.

```ts
import { ApiController, RouteVersion, HttpGet, HttpResponse } from "nubie";

@ApiController()
class AuthController {
  @HttpGet("login")
  @RouteVersion(3)
  public async loginUserAsync() {
    return HttpResponse.Ok({ version: 3, message: "Login successful" });
  }
}
```

> Effect: Only the `login` route will be served under version `3`. Other routes in the same controller will use the controller’s version (or the default version if none is set).

## Best Practices

- Use `@ApiVersion()` for major version changes that affect all routes in a controller.
- Use `@RouteVersion()` for incremental updates or experimental endpoints.
- Keep versioning consistent across your API to avoid confusion for consumers.
