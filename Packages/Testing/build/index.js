"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@nubie/framework");
framework_1.BuildScanner.scanFilesAsync("Command", { parentDir: "commands" })
    .then((files) => {
    files.forEach(({ service, introspector }) => {
        service.addSingleton(introspector.className, introspector.classConstructor);
    });
})
    .finally(() => {
    framework_1.Nubie.createApp().runAsync();
});
