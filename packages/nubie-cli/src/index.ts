import figlet from "figlet";
import pkg from "../package.json";
import { Command } from "commander";
import { NewProjectCommand } from "./commands";

console.log(figlet.textSync("N U B I E"));

const command = new Command();

command
    .name("Nubie CLI")
    .description("CLI to manage nubie application")
    .version("CLI Version: " + pkg.version, "-v, --version");

const commandsList = [NewProjectCommand];

commandsList.forEach((cmd) => new cmd(command));
command.parse(process.argv);
