class Logger {
    public info(message: string) {
        console.info(message);
    }
    public warn(message: string) {
        console.warn(message);
    }
    public success(message: string) {
        console.log(message);
    }
    public error(message: string) {
        console.error(message);
    }
}

export default new Logger();
