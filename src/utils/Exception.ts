export default class Exception extends Error {
    public statusCode: number;
    public code: string;
    public timeStamp: string;

    public constructor(message: string, statusCode: number) {
        super(message);
        this.timeStamp = new Date().toISOString();
        this.statusCode = statusCode;
        this.name = new.target.name;
        this.code = this.name;

        Object.setPrototypeOf(this, new.target.prototype);
    }

    public toJson() {
        return {
            type: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/${this.statusCode}`,
            message: this.message,
            status: this.statusCode,
            code: this.code,
            timestamp: this.timeStamp,
        };
    }
}
