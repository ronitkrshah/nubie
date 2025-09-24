# Api Controller

The `@ApiController()` decorator is the entry point to Nubie's routing system. It marks a class as a controller and allows Nubie to automatically register its methods as API endpoints.

No need to manually configure routers or import controllers — Nubie handles it for you.

## What Is a Controller?

In Nubie, a controller is a class that groups related API routes. Each controller maps to a base path (e.g., `/users`, `/auth`) and contains methods decorated with HTTP verbs like `@HttpGet()`, `@HttpPost()`, etc.

This structure promotes clarity and separation of concerns, making your API easier to maintain and scale.

## How Nubie Handles Controllers?

When your application starts, Nubie performs the following steps:

- Scans the `controllers/` directory for valid controller classes.
- Identifies classes decorated with `@ApiController()`, regardless of whether they are exported.
- Derives the route prefix from the `class name` or a `custom string`.
- Registers decorated methods as route handlers using Reflection.
- Applies middleware such as `validation`, `authentication`, and `dependency injection` based on additional decorators.

> You do not need to export your controller classes. Nubie automatically imports and registers them during startup.

## Example: Basic Controller

```ts
import { ApiController, HttpGet, HttpResponse } from "nubie";

@ApiController()
class UsersController {
  @HttpGet("hello")
  public async sayHiAsync() {
    return HttpResponse.Ok({ message: "Hello from Nubie" });
  }
}
```

## What Happens Here

- Nubie detects `UsersController` as a valid controller.
- It maps the class to `/users` based on its name.
- It registers `sayHiAsync()` as a handler for `GET /api/v1/users/hello`.
