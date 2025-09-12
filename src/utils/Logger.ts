class Logger {
    public log(message: string) {
        const dateTime = new Date();
        console.log(`[${dateTime.toLocaleTimeString()}] ${message}\n`);
    }
}

export default new Logger();
