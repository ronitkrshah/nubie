import { ICommand } from "./ICommand";
import { Command } from "commander";
import { ChildProcess, ChildProcessWithoutNullStreams, spawn } from "node:child_process";

export class DevelopmentServerCommand implements ICommand {
    private readonly _command: Command;

    private _tscProcess: ChildProcessWithoutNullStreams | null = null;
    private _nodeProcess: ChildProcess | null = null;

    constructor(command: Command) {
        this._command = command;
    }

    public init() {
        this._command
            .command("dev")
            .description("Initiates the development server")
            .action((args) => {
                this.startDev();
            });
    }

    private startDev() {
        console.log("[info]: starting development server");
        this.startTypescriptServer();
    }

    private startTypescriptServer() {
        this._tscProcess = spawn("npx", ["tsc", "-w"]);

        this._tscProcess.stdout.on("data", (data: Buffer) => {
            const text = data.toString();

            if (
                text.includes("Compilation complete") ||
                text.includes("Watching for file changes")
            ) {
                console.log("[info]: rebuild completed, restarting server...");
                this.restartNodeJsServer();
            }
        });

        this._tscProcess.stderr.on("data", (data) => process.stderr.write(data));
    }

    private restartNodeJsServer() {
        if (this._nodeProcess !== null) {
            this._nodeProcess.kill("SIGTERM");
        }

        this._nodeProcess = spawn("node", ["build/main.js"], {
            stdio: "inherit",
        });
    }
}
