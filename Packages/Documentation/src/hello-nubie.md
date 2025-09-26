# Hello Nubie

Once your Nubie project is installed, you can start building your first API endpoint.

::: info
Create a `src` directory if not exists
:::

## Step 1: Initialize Nubie

In `src/index.ts`, make sure you have the following setup:

```ts
import { Nubie } from "@nubie/framework";

Nubie.createApp().runAsync();
```

This bootstraps the Nubie framework, loads your controllers, and starts the Express server.

## Step 2: Create a Controller

Inside `src/controllers`, create a new file called `HelloController.ts`:

```ts
import { ApiController, HttpGet, HttpResponse } from "@nubie/framework";

@ApiController()
export default class HelloController {
    @HttpGet("/")
    public async sayHelloAsync() {
        return HttpResponse.Ok({ message: "Hello from Nubie!" });
    }
}
```

::: warning
File name and class name must be same and controller should be exported default

eg: `UsersController.ts` -> `export default class UsersController {}`
:::

## Step 3: Compile Code

Before running the server for the first time we have to create a build

```bash
npm run build
```

## Step 4: Run

```bash
npm run run
```

Your api is live at `http://localhost:8080/api/v1/hello`. With this JSON response

```json
{
    "message": "Hello from Nubie!"
}
```
