import { Command } from "commander";
import fs from "fs";
import childProcess from "node:child_process";
import path from "node:path";
import { ICommand } from "./ICommand";

const mainFile = `
import { NubieApplication, RestController, HttpGet } from "nubie-framework";

const app = new NubieApplication();

/** Api Controller */
@RestController()
class NubieController {

    @HttpGet("/")
    public async greet() {
        return { message: "Hello World!" }
    }
}

app.run()
`;

const gitIgnoreFile = `
node_modules/
build/
.env
`;

const prettierConfig = `
{
    "tabWidth": 4,
    "printWidth": 80,
}
`;

const tsConfig = `
{
    "compilerOptions": {
        "target": "es2022",
        "module": "commonjs",
        "esModuleInterop": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "outDir": "build",
        "rootDir": "src"
    },
    "exclude": ["node_modules", "build"]
}
`;

export class NewProjectCommand implements ICommand {
    private readonly _command: Command;

    constructor(command: Command) {
        this._command = command;
    }

    public init() {
        this._command
            .command("create")
            .requiredOption("-o, --output <string>", "Output directory")
            .option("--skip-git-init", "Do not initialize git repo")
            .description("Bootstrap a new nubie application")
            .action((args) => {
                const options: Record<string, string | boolean> = args.opts();

                try {
                    this.handleNewProjectCreation(options.output as string);
                    if (!options.skipGitInit) this.initializeGitRepo();
                } catch (e) {
                    console.log("[error]:", (e as Error).message);
                }
            });
    }

    private handleNewProjectCreation(directory: string): void {
        console.log("[info]: project creation initialized");

        console.log("[info]: working dir :: " + directory);

        const isExists = fs.existsSync(directory);
        if (isExists) {
            console.log("[error]: directory exists :: process halted");
            process.exit();
        }

        fs.mkdirSync(directory);
        process.chdir(directory);

        const commands = [
            {
                cmd: "npm init --yes",
                log: "[info]: initializing project",
            },
            {
                cmd: "npm pkg set main=build/main.js",
                log: "[info]: updating build entry point",
            },
            {
                cmd: "npm install --save express dotenv",
                log: "[info]: setting up nubie app",
            },
            {
                cmd: "npm install --save-dev typescript @types/node @types/express @types/multer nubie-cli",
                log: "[info]: installing dev dependencies",
            },
        ];

        commands.forEach((it) => {
            console.log(it.log);
            childProcess.execSync(it.cmd);
        });

        console.log("[info]: writing entry point");
        fs.mkdirSync(path.join(process.cwd(), "src"));

        [
            { fileName: "main.ts", content: mainFile, path: "src" },
            { fileName: "tsconfig.json", content: tsConfig },
            { fileName: ".gitignore", content: gitIgnoreFile },
            { fileName: ".prettierrc", content: prettierConfig },
        ].forEach((file) => {
            fs.writeFileSync(
                path.join(process.cwd(), file.path || "", file.fileName),
                file.content,
                {
                    encoding: "utf-8",
                },
            );
        });

        // Modifying package.json
        const projectJson = fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8");
        const jsonData = JSON.parse(projectJson);

        delete jsonData.author;
        delete jsonData.keywords;
        delete jsonData.description;

        jsonData.version = "0.1.0";

        jsonData.scripts = {
            dev: "nubie run",
            build: "tsc",
        };

        fs.unlinkSync(path.join(process.cwd(), "package.json"));
        fs.writeFileSync(
            path.join(process.cwd(), "package.json"),
            JSON.stringify(jsonData, null, 2),
        );

        console.log("[success]: project creation success");
    }

    private initializeGitRepo(): void {
        console.log("[info]: initializing git repo");
        childProcess.execSync("git init", { stdio: "ignore" });
        childProcess.execSync("git branch -m main");
        childProcess.execSync("git add .");
        childProcess.execSync(
            "git commit -m 'app: skeleton' --author='RKS <ronitkrshah@tuta.io>' --no-signoff",
        );
        console.log("[success]: git repo initialized");
    }
}
