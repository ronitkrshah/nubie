import { Exception } from "./Exception";

export class HttpException extends Exception {
    public readonly statusCode: number;
    public readonly explanation: string;

    protected constructor(
        message?: string,
        statusCode: number = 500,
        explanation: string = "Further details not available",
    ) {
        super(message ?? "Something Went Wrong");
        this.statusCode = statusCode;
        this.explanation = explanation;

        Object.setPrototypeOf(this, HttpException.prototype);
    }

    public toJSON() {
        return {
            success: false,
            data: null,
            target: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/${this.statusCode}`,
            statusCode: this.statusCode,
            message: this.message,
            explanation: this.explanation,
            exception: this.name,
        };
    }
}
