import { AppConfiguration } from "./config";
import * as FileSystem from "node:fs/promises";
import AppContext from "./AppContext";

class NubieCore {
    private async loadControllersAsync() {
        const config = await AppConfiguration.getAppConfigAsync();
        const controllerDirectory = `${AppConfiguration.projectPath}/${config.buildDir}/${config.controllersDirectory}`;
        let isDirExists = false;
        try {
            await FileSystem.stat(controllerDirectory);
            isDirExists = true;
        } catch (error) {
            // ... ignore
        }

        if (!isDirExists) return;

        /** Importing Controllers */
        const files = await FileSystem.readdir(controllerDirectory, { recursive: true });
        for (const file of files) {
            if (file.endsWith("Controller.js")) {
                await import(`${controllerDirectory}/${file}`);
            }
        }
    }

    private async configureControllerAsync() {
        for (const controller of Array.from(AppContext.ApiControllers.values())) {
            await controller.registerControllerAsync();
        }
    }

    public async setupRouterAsyc(): Promise<void> {
        await this.loadControllersAsync();
        await this.configureControllerAsync();
    }
}

export default new NubieCore();
