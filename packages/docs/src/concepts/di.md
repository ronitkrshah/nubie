# Dependency Injection

Nubie provides a structured approach to Dependency Injection (DI) using [tsyringe](https://github.com/microsoft/tsyringe) under the hood.

## Registering Services

With Nubie, you can assign service via `addServices` method

```ts
Nubie.createApp().addServices([InfrastructureDi, ApplicationDi]).runAsync();
```

## Defining Services

Create a class that will tell `Nubie` to register dependencies.

```ts
// application/DependencyInjection.ts
import { IServiceCollection } from "nubie";

export class ApllicationDi {
  constructor(serviceCollection: IServiceCollection) {
    serviceCollection.addScoped("IAuthService", AuthService);
    // serviceCollection.addSingelton("IAuthService", AuthService);
    // serviceCollection.addTransient("IAuthService", AuthService);
  }
}
```

## Injection

Use the `@Inject` decorator to request dependencies in your controller / other classes constructors. Nubie automatically resolves these dependencies at runtime.

```ts
import { ApiController, HttpGet, HttpResponse } from "nubie";
import { Inject } from "nubie";

@ApiController()
class AuthenticationController {
  private readonly _authService: IAuthService;

  constructor(@Inject("IAuthService") authService: IAuthService) {
    this._authService = authService;
  }
}
```

# Folder Structure

To enable automatic registration:

```
src/
 └─ services/
     ├─ Injection.ts      // Imports all service classes
     ├─ MusicService.ts
     └─ AuthService.ts

// services/Injection.ts
import "./MusicService";
import "./AuthService";

```

Nubie scans this folder and registers all classes marked with `@Injectable`.

## Lifecycles

- **Singleton:** One instance shared across the application.
- **Scoped (default):** One instance per request.
- **Transient:** A new instance every time the dependency is resolved.

This ensures proper management of state and isolation of services per request or per resolution.
