import "reflect-metadata";
import { ApiVersion, HttpGet, RestController } from "./controllers/rest";
import { Nubie } from "./Nubie";
import { DIContainer, Inject } from "@nubie/di";

class Meow {
    public randInt = Math.random();
}

DIContainer.addScoped("DI", Meow);

@RestController()
@ApiVersion(2)
class UsersController {
    protected name = "meow";
    protected rand = Math.random().toString(36);

    public constructor(
        @Inject("DI") public readonly meow: Meow,
        @Inject("DI") public readonly meow2: Meow,
    ) {}

    @HttpGet("/")
    public async sayHi() {
        return { message: "Hello" };
    }

    @HttpGet("/hi")
    public async sayHello() {
        return { message: "Hello" };
    }
}

Nubie.createApplication().runAsync();
