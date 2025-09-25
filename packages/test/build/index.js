"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@nubie/framework");
framework_1.Module.scanFilesAsync("Command", { parentDir: "commands" })
    .then((files) => {
    files.forEach(({ service, metadata }) => {
        service.addSingleton(metadata.className, metadata.constructor);
    });
})
    .finally(() => {
    framework_1.Nubie.createApp().runAsync();
});
