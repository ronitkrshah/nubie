import { Module, Nubie } from "@nubie/framework";

Module.scanFilesAsync("Command", { parentDir: "commands" })
    .then((files) => {
        files.forEach(({ service, metadata }) => {
            service.addSingleton(metadata.className, metadata.constructor);
        });
    })
    .finally(() => {
        Nubie.createApp().runAsync();
    });
