# Hello Nubie

Once your Nubie project is installed, you can start building your first API endpoint.

::: info
Create a `src` directory if not exists
:::

## Step 1: Initialize Nubie

In `src/index.ts`, make sure you have the following setup:

```ts
import { Nubie } from "nubie";

Nubie.createApp().runAsync();
```

This bootstraps the Nubie framework, loads your controllers, and starts the Express server.

## Step 2: Create a Controller

Inside `src/controllers`, create a new file called `HelloController.ts`:

```ts
import { ApiController, HttpGet, HttpResponse } from "nubie";

@ApiController()
class HelloController {
  @HttpGet("/")
  public async sayHelloAsync() {
    return HttpResponse.Ok({ message: "Hello from Nubie!" });
  }
}
```

> You may have noticed that we didn’t export the `HelloController` class. This is intentional. Nubie automatically scans the controllers directory and registers all valid controller classes based on naming conventions. As long as your class name ends with `Controller` and is placed in the correct folder `(src/controllers)`, Nubie will detect and wire it into the application without requiring manual imports or exports. This keeps your codebase clean and focused on logic, not setup.

## Step 3: Compile Code

Before running the server for the first time we have to create a build

```bash
npx tsc
```

## Step 4: Run

```bash
npm run dev
```

Your api is live at `http://localhost:8080/api/v1/hello`. With this JSON response

```json
{
  "message": "Hello from Nubie!"
}
```
