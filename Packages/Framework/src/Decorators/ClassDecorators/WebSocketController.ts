import AppState from "../../AppState";
import type { WebSocketControllerBase } from "../../Abstractions/Controller";
import { ControllerBase } from "../../Abstractions/Controller";
import { Logger } from "../../Utilities";
import { ServiceCollection } from "../../Extensions/ServiceCollection";

class WebSocketControllerDecorator extends ControllerBase {
    private readonly _endpoint: string;

    public constructor(endpoint: string) {
        super();
        this._endpoint = endpoint;
    }

    /**
     * Validates the format or structure of the controller class name.
     *
     * Used to enforce naming conventions or detect misconfigurations.
     */
    private validateClassName() {
        const className = this._target.name;
        const isValidControllerName = className.endsWith("Controller");
        if (!isValidControllerName) {
            Logger.log(`Invalid Controller Name: ${className}. Aborting Execution..`);
            process.exit(1);
        }
    }

    /**
     * Asynchronously configures the controller instance.
     *
     * Used to initialize routes, middleware, or metadata before registration.
     */
    private async configureControllerAsync() {
        const io = AppState.socketIo.of(this._endpoint);
        const instance = ServiceCollection.resolveInstance<WebSocketControllerBase>(this._target.name);

        instance.io = io;

        try {
            io.on("connection", (socket) => {
                instance.onConnection(socket);
                socket.on("disconnect", function (reason) {
                    instance.onDisconnect(socket, reason);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    public async registerControllerAsync(): Promise<void> {
        this.validateClassName();
        await this.configureControllerAsync();
    }
}

const WebSocketController = ControllerBase.createDecorator(WebSocketControllerDecorator);

export default WebSocketController;
