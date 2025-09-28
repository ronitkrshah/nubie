import { BuildScanner, Nubie } from "@nubie/framework";

BuildScanner.scanFilesAsync("Command", { parentDir: "commands" })
    .then((files) => {
        files.forEach(({ service, introspector }) => {
            service.addSingleton(introspector.className, introspector.classConstructor);
        });
    })
    .finally(() => {
        Nubie.createApp().runAsync();
    });
