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
import { IServiceCollection } from "@nubie/framework";

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
import { ApiController, HttpGet, HttpResponse } from "@nubie/framework";
import { Inject } from "@nubie/framework";

@ApiController()
class AuthenticationController {
    private readonly _authService: IAuthService;

    constructor(@Inject("IAuthService") authService: IAuthService) {
        this._authService = authService;
    }
}
```
