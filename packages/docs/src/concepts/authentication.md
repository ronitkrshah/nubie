# Authentication & Roles

Security in Nubie is simple but powerful — and built right into your route handlers with these decorators.

> **Important Setup**: Make sure your `Nubie.json` file includes a valid `jwtSecretKey`. Without it, token validation won’t work.

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

## Generate Token with `JWTToken` Class

If you need to generate or manually verify tokens (e.g non-route logic):

```ts
import { JWTToken } from "nubie";

const token = new JWTToken();
token.addClaim("iss", "Nubie");

console.log(await token.generateTokenAsync());

const payload = await JWTToken.verifyTokenAsync(token); // Decodes and validates
```
