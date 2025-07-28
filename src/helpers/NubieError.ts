export default class NubieError extends Error {
    public statusCode: number;
    public explaination: unknown;

    public constructor(message: string, statusCode: number, explaination: unknown = "Something Went Wrong") {
        super(message);
        this.statusCode = statusCode;
        this.explaination = explaination;

        Object.setPrototypeOf(this, NubieError.prototype);
    }
}
