const defaultExplanations: Record<number, string> = {
    200: "All good — request completed successfully",
    201: "Resource created successfully",
    202: "Request accepted and is on its way",
    204: "Success — nothing more to say",

    400: "That request didn’t look right",
    401: "You need to log in first",
    403: "Nice try, but you don’t have access",
    404: "We looked everywhere, but found nothing",
    405: "This route doesn’t like that method",
    409: "Your request bumped into a conflict",
    422: "We understood the request, but couldn’t process it",
    429: "Easy there, too many requests",

    500: "Something broke on our side",
    501: "We don’t do that (yet)",
    502: "Got a bad response from upstream",
    503: "We’re overloaded or down for maintenance",
    504: "The upstream service took too long",
};

export default class NubieError extends Error {
    public statusCode: number;
    public explaination: string;

    public constructor(message: string, statusCode: number, explaination?: any) {
        super(message);
        this.statusCode = statusCode;
        this.explaination = explaination ?? defaultExplanations[statusCode] ?? "An error occurred.";

        Object.setPrototypeOf(this, NubieError.prototype);
    }
}
