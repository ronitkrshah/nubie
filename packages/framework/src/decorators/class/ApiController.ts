import type { NextFunction, RequestHandler, Request, Response } from "express";
import { Router } from "express";
import type { TMethodMetadata } from "../../abstractions";
import AppState from "../../AppState";
import { ApplicationConfig } from "../../configuration";
import type { TMethodResponse } from "../../http";
import { Logger } from "../../utilities";
import { ControllerBase } from "../../abstractions";
import { ServiceCollection } from "../../extensions/service-collection";

export type TApiControllerMetadata = {
    endpoint: string;
    apiVersion?: number;
    methods?: Record<string, TMethodMetadata>;
};

class ApiControllerDecorator extends ControllerBase {
    private _endpoint?: string;
    private readonly _router: Router;

    public constructor(endpoint?: string) {
        super();
        this._endpoint = endpoint;
        this._router = Router();
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
        if (!this._endpoint) {
            this._endpoint = className.replace("Controller", "").toLowerCase();
        }
    }

    /**
     * Asynchronously configures the controller instance.
     *
     * Used to initialize routes, middleware, or metadata before registration.
     */
    private async configureControllerAsync() {
        const appConfig = ApplicationConfig.config;
        const metadata: TApiControllerMetadata =
            Reflect.getOwnMetadata(ControllerBase.METADATA_KEY, this._target) || {};

        /** Registering methods */
        for (const [methodName, methodMetadata] of Object.entries(metadata.methods || {})) {
            const apiVersion =
                methodMetadata.apiVersion || metadata.apiVersion || appConfig.HttpRequest.DefaultApiVersion;

            const fullpath = `/api/v${apiVersion}/${this._endpoint}/${methodMetadata.endpoint}`.replace(/\/+/g, "/");

            const requestHandlers: RequestHandler[] = [];

            /**
             * Middlewares like file upload via multer
             */
            methodMetadata.middlewares?.forEach((middleware) => {
                requestHandlers.push(middleware);
            });

            /**
             * Actual Incoming Express Request
             */
            const handleApiRequest = async (req: Request, res: Response, next: NextFunction) => {
                const instance: {
                    [key: string]: (...args: unknown[]) => Promise<TMethodResponse>;
                } = ServiceCollection.resolveInstance(this._target.name);
                const uniqueExtensionKey = `${this._target.name}_${methodName}`;

                try {
                    // Calling decorator-extensions from top to bottom instead of bottom to top
                    const methodExtensions = AppState.getMethodExtensions(uniqueExtensionKey);
                    for (let i = methodExtensions.length - 1; i >= 0; i--) {
                        await methodExtensions[i].executeAsync(req, res, next);
                    }

                    const arguements: unknown[] = [];
                    for (const param of AppState.getParamExtensions(uniqueExtensionKey)) {
                        arguements[param.paramIndex] = await param.executeAsync(req, res, next);
                    }

                    const result = await instance[methodName](...arguements);
                    if (result) {
                        return res.status(result.statusCode).json(result.data);
                    }
                } catch (error) {
                    next(error);
                }
            };

            requestHandlers.push(handleApiRequest);
            this._router[methodMetadata.httpMethod](fullpath, ...requestHandlers);
        }
    }

    /**
     * Method To Register Controller
     */
    public async registerControllerAsync(): Promise<void> {
        this.validateClassName();
        await this.configureControllerAsync();
        AppState.expressApp.use(this._router);
    }
}

/**
 * Marks a class as an API controller.
 *
 * Enables route registration and metadata tracking for the decorated class.
 */
const ApiController = ControllerBase.createDecorator(ApiControllerDecorator);

export default ApiController;
