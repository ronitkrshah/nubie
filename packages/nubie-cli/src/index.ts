import figlet from "figlet";
import pkg from "../package.json";
import { Command } from "commander";
import { ICommand, NewProjectCommand, DevelopmentServerCommand } from "./commands";

console.log(figlet.textSync("N U B I E"));

const command = new Command();

command
    .name("Nubie CLI")
    .description("CLI to manage nubie application")
    .version("CLI Version: " + pkg.version, "-v, --version");

const commandsList: (new (...args: [Command]) => ICommand)[] = [
    NewProjectCommand,
    DevelopmentServerCommand,
];

commandsList.forEach((cmd) => {
    const c = new cmd(command);
    c.init();
});
command.parse(process.argv);
