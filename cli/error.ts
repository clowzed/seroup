export class SeroError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, SeroError.prototype);
    }

    static newfrom(error: unknown): SeroError {
        if (error instanceof Error) {
            return new SeroError(error.message);
        } else {
            return new SeroError("Unknown");
        }
    }

    static from_string(error: string): SeroError {
        return new SeroError(error);
    }
}
