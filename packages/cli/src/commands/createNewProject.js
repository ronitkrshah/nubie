const path = require("node:path");
const fs = require("node:fs/promises");
const { exec } = require("node:child_process");
const { getPackageJson, getTsConfig } = require("../template");

/**
 * Check id a directory exists
 * @param {string} dir
 * @returns {Promise<boolean>}
 */
async function isDirExists(dir) {
    let exists = false;
    try {
        const result = await fs.stat(dir);
        exists = result.isDirectory();
    } catch {
        exists = false;
    }
    return exists;
}

/**
 * Run a shell command in a specific directory
 * @param {string} command
 * @param {string} cwd - Current working directory to run the command in
 * @returns {Promise<void>}
 */
function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        const subprocess = exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            if (stdout) {
                console.log(stdout);
            }
            resolve();
        });

        subprocess.stdout?.pipe(process.stdout);
        subprocess.stderr?.pipe(process.stderr);
    });
}


/**
 * @param {string} directory
 * @returns {Promise<void>}
 */
async function createNewProject(directory) {
    const workingDirectory = path.join(path.resolve(), directory);

    const exists = await isDirExists(workingDirectory);
    if (exists) {
        console.log(`${workingDirectory} already exists`);
        process.exit(0);
    }

    console.log(`Creating Project: ${workingDirectory}`);

    await fs.mkdir(workingDirectory);
    await fs.writeFile(
        path.join(workingDirectory, "package.json"),
        JSON.stringify(getPackageJson(directory.toLowerCase()), null, 2),
    );
    await fs.writeFile(
        path.join(workingDirectory, "tsconfig.json"),
        JSON.stringify(getTsConfig(), null, 2),
    );

    // Download Latest tar file
    const response = await fetch("https://api.github.com/repos/ronitkrshah/nubie/releases");
    const data = await response.json();
    const nubiePackage = data[0].assets[0].browser_download_url

    const depsCommand = ["npm", "install", nubiePackage, "class-validator", "class-transformer", "socket.io"].join(" ")
    const devDepsCommand = ["npm", "install", "-D", "typescript", "@types/node", "@types/express@4"].join(" ")

    await runCommand(depsCommand, workingDirectory);
    await runCommand(devDepsCommand, workingDirectory);
}
module.exports = createNewProject;
