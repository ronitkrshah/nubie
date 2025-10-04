export class Exception extends Error {
    public constructor(message: string) {
        super(message);

        this.name = new.target.name;
        Object.setPrototypeOf(this, Exception.prototype);
    }
}
