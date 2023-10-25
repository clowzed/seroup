"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeroError = void 0;
class SeroError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, SeroError.prototype);
    }
    static newfrom(error) {
        if (error instanceof Error) {
            return new SeroError(error.message);
        }
        else {
            return new SeroError("Unknown");
        }
    }
    static from_string(error) {
        return new SeroError(error);
    }
}
exports.SeroError = SeroError;
//# sourceMappingURL=error.js.map