# Rate Limiting

Nubie provides a simple, decorator-based way to apply **rate limiting** at the method level.  
This helps you protect sensitive endpoints from abuse by restricting the number of requests within a given time frame.


## Configuration

Before using rate limiting in your controllers, you need to register a rate limit policy in your **index.ts** file:

```ts
// index.ts
import { RateLimit } from "nubie";

new RateLimit("fixed", {
  timeFrameInMinutes: 1,
  requestLimit: 200,
});
```

- "fixed" — A unique key.
- timeFrameInMinutes — The time window for counting requests.
- requestLimit — The maximum number of requests allowed within the time window.

## Applying Rate Limits to Endpoints

Once a rate limit policy is registered, you can apply it to specific controller methods using the `@LimitRequest()` decorator:

```ts
import { 
  ApiController, 
  HttpGet, 
  HttpResponse, 
  LimitRequest 
} from "nubie";

@ApiController()
class AuthController {
  @HttpGet("status")
  @LimitRequest("fixed")
  public async getStatusAsync() {
    return HttpResponse.Ok({ version: 2, status: "OK" });
  }
}

```

### How it works

The `@LimitRequest("fixed")` decorator applies the registered fixed-window rate limit to this endpoint.

If a client exceeds the configured limit (e.g., 200 requests per minute), Nubie automatically returns a 429 Too Many Requests response.

## Multiple Policies

You can define multiple rate limit policies with different names and strategies. For example:

```ts
// index.ts
new RateLimit("login", { timeFrameInMinutes: 5, requestLimit: 10 });
new RateLimit("api", { timeFrameInMinutes: 1, requestLimit: 200 });

// controllers/UsersController.ts
@ApiController()
class UsersController {
  @HttpGet("profile")
  @LimitRequest("api")
  public async getProfileAsync() {
    return HttpResponse.Ok({ user: "John Doe" });
  }

  @HttpGet("login")
  @LimitRequest("login")
  public async loginAsync() {
    return HttpResponse.Ok({ success: true });
  }
}

```

## Default Behavior

- If no rate limit is applied, the endpoint is unrestricted.
- Rate limit policies are global but applied per endpoint using `@LimitRequest()`.
- Exceeding the limit returns an HTTP 429 with a JSON error message.

