import { NextFunction, RequestHandler, Request, Response, Router } from "express";
import { ControllerBase, TMethodMetadata } from "../../base";
import AppState from "../../AppState";
import { AppConfig } from "../../config";
import { DiContainer, TMethodResponse } from "../../core";
import { Logger, Metadata } from "../../utils";
import { TConstructor } from "../../types";

export type TApiControllerMetadata = {
    endpoint: string;
    apiVersion?: number;
    methods?: Record<string, TMethodMetadata>;
    constructorInjections?: {
        token: string;
        paramIndex: number;
    }[];
};

class ApiControllerDecorator extends ControllerBase {
    private _endpoint?: string;
    private _router = Router();

    public constructor(endpoint?: string) {
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
        if (!this._endpoint) {
            this._endpoint = className.replace("Controller", "").toLowerCase();
        }
    }

    /**
     * Injects constructor dependencies into the target class.
     *
     * Returns an instance with all required dependencies resolved.
     *
     * @returns The instantiated class with injected dependencies.
     */
    private injectConstructorDependencies(
        Class: TConstructor,
        constructorInjection: TApiControllerMetadata["constructorInjections"],
    ) {
        const arguements: unknown[] = [];
        for (const injectionData of constructorInjection || []) {
            arguements[injectionData.paramIndex] = DiContainer.resolve(injectionData.token);
        }

        return new Class(...arguements);
    }

    /**
     * Asynchronously configures the controller instance.
     *
     * Used to initialize routes, middleware, or metadata before registration.
     */
    private async configureControllerAsync() {
        const appConfig = await AppConfig.getConfig();
        const metadata = Metadata.getMetadata(ControllerBase.METADATA_KEY, this._target) as TApiControllerMetadata;
        const instance = this.injectConstructorDependencies(this._target, metadata.constructorInjections);

        /** Registering methods */
        for (const [methodName, methodMetadata] of Object.entries(metadata.methods || {})) {
            const apiVersion = methodMetadata.apiVersion || metadata.apiVersion || appConfig.defaultApiVersion;
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
                const uniqueExtensionKey = `${this._target.name}_${methodName}`;
                for (const method of AppState.getMethodExtensions(uniqueExtensionKey)) {
                    await method.executeAsync(req, res, next);
                }

                const arguements: unknown[] = [];
                for (const param of AppState.getParamExtensions(uniqueExtensionKey)) {
                    arguements[param.paramIndex] = await param.executeAsync(req, res, next);
                }

                const data: TMethodResponse<any> = await instance[methodName](...arguements);
                if (data) {
                    return res.status(data.statusCode).json(data.data);
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
