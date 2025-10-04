import "reflect-metadata";
import { HttpGet, QueryParam, RestController, RouteParam } from "./controllers/rest";
import { Nubie } from "./Nubie";
// import { Exception } from "./utils";
// import { Nubie } from "./Nubie";
//
// export * from "./controllers/rest";
// export * from "./core/config";
// export * from "./core/security/jwt";
//
// export { Exception, Nubie };

@RestController()
class UsersController {
    @HttpGet("/")
    public async sayHi(@QueryParam("id") id: string) {
        return { query: id };
    }
}

Nubie.createApplication().runAsync();
