import chalk from "chalk";

class Logger {
    public success(message: string) {
        console.log(chalk.greenBright(`✅ ${message}`));
    }

    public info(message: string) {
        console.log(chalk.cyanBright(`ℹ️  ${message}`));
    }

    public warning(message: string) {
        console.log(chalk.yellowBright(`⚠️  ${message}`));
    }

    public error(message: string) {
        console.log(chalk.redBright(`❌ ${message}`));
    }

    public divider() {
        console.log(chalk.gray("=".repeat(50)));
    }

    public title(message: string) {
        this.divider();
        console.log(chalk.bold.cyanBright(`🚀 ${message}`));
        this.divider();
    }
}

export default new Logger();
