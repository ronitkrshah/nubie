# Authentication & Roles

Security in Nubie is simple but powerful — and built right into your route handlers with these decorators.

## Authentication

Validates the JWT token present in the request headers. If the token is missing or invalid, it auto-responds with an **unauthenticated** error — no extra work needed!

```ts
@HttpGet("/profile")
@Authorize()
async getProfileAsync(@User() user: UserEntity) {
  // Runs only if token is valid
}
```

- Looks for a standard `Authorization: Bearer <token>` header.

## Roles

For endpoints that require specific user roles, use `@Roles()`!

```ts
@HttpPatch("/delete-user")
@Authorize()
@Roles("Admin")
async deleteUserAsync() {
  // Token must be valid & contain role === "Admin"
}
```

- Accepts a string or array of strings:
    ```ts
    @Roles(["Moderator", "Editor"])
    ```
- Auto-validates the token & checks `role` field in payload.
- Must use `@Authorize()` before `@Roles`

## Generate Token with `JwtToken` Class

If you need to generate or manually verify tokens (e.g non-route logic):

```ts
import { JwtToken } from "@nubie/framework";

const claims = [new JwtClaim("exp", Date.now()), new JwtClaim("aud", "www.github.com")];

const token = new JwtToken(claims);

console.log(token.generateToken());

const payload = Jwtoken.verifyToken(token); // Decodes and validates
```
