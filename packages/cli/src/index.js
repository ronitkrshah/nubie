#!/usr/bin/env node
const { program } = require("commander");
const { createNewProject } = require("./commands");

program
    .name("Nubie CLI")
    .description("Command Line Interface To Manage Nubie Project")
    .version("0.1.0");

program
    .command("bootstrap")
    .description("Create A New Project")
    .argument("<string>", "Directory Name")
    .action(async (str, options) => {
        try {
            await createNewProject(str);
        } catch(e) {
            console.error(e);
        }
    });

program.parse();
