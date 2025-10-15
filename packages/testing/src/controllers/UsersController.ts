import { HttpGet, RestController } from "@nubie/framework";

@RestController()
export default class UsersController {
    @HttpGet("/")
    public async sayHi() {
        return { message: "Hello" };
    }
}
