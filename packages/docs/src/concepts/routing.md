# Routing

Nubie provides a **clean, expressive, and decorator-based routing system**.  
You don’t need to manually wire up routes — simply annotate your controller methods, and Nubie handles the rest.

## Supported HTTP Method Decorators

Nubie offers the following decorators for defining route handlers:

- `@HttpGet()` – Handle **GET** requests
- `@HttpPost()` – Handle **POST** requests
- `@HttpPut()` – Handle **PUT** requests
- `@HttpDelete()` – Handle **DELETE** requests
- `@HttpPatch()` – Handle **PATCH** requests

Each decorator corresponds to its HTTP method and registers the method as a route handler within your controller.

> **Return Values:**  
> Every route method should return an object literal wrapped in an `HttpResponse` helper (e.g., `HttpResponse.Ok(...)`).  
> If you handle the response manually (e.g., via `res.send()`), you may return `undefined`.

## GET

Handles **read-only** requests.

```ts
import { ApiController, HttpGet, HttpResponse } from "nubie";

@ApiController()
class ProductController {
  @HttpGet("/")
  public async getAllProductsAsync() {
    return HttpResponse.Ok(["apple", "banana", "carrot"]);
  }
}
```

> ⚠ Important: GET requests must not contain a request body. Use query parameters or route parameters instead.

## POST

Handles resource creation.

```ts
import { ApiController, HttpPost, HttpResponse, Body } from "nubie";

@ApiController()
class ProductController {
  @HttpPost("/create")
  public async createProductAsync(
    @Body() product: Record<string, string | number>
  ) {
    return HttpResponse.Created({ id: 1, ...product });
  }
}
```

## Other HTTP Methods

Nubie also supports:

- PUT – Replace or fully update a resource.
- DELETE – Remove a resource.
- PATCH – Partially update a resource.

> Pro Tip: The usage pattern for these methods is the same as `@HttpGet()` and `@HttpPost()`. Experiment with them in your own controllers to handle updates, deletions, and partial modifications.
