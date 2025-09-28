import { ApiController, HttpGet, HttpResponse, Inject } from "@nubie/framework";
import GetUserCommand from "../commands/GetUserCommand";

@ApiController()
export default class UsersController {
    public constructor(@Inject("GetUserCommand") private readonly getUser: GetUserCommand) {}

    @HttpGet("/")
    public async generate() {
        return HttpResponse.Ok({ message: this.getUser.message });
    }
}
