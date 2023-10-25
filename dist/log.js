"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.getLogLevel = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["TRACE"] = 0] = "TRACE";
    LogLevel[LogLevel["DEBUG"] = 1] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["WARN"] = 3] = "WARN";
    LogLevel[LogLevel["ERROR"] = 4] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
function getLogLevel(level) {
    switch (level) {
        case "trace":
            return LogLevel.TRACE;
        case "debug":
            return LogLevel.DEBUG;
        case "warn":
            return LogLevel.WARN;
        case "error":
            return LogLevel.ERROR;
        default:
            return LogLevel.INFO;
    }
}
exports.getLogLevel = getLogLevel;
class Logger {
    constructor(level) {
        this.level = level;
    }
    setLevel(level) {
        this.level = level;
    }
    getEmoji(level) {
        switch (level) {
            case LogLevel.TRACE:
                return "\x1b[1m\x1b[95m→\x1b[0m";
            case LogLevel.DEBUG:
                return "\x1b[1m\x1b[37m→\x1b[0m";
            case LogLevel.INFO:
                return "\x1b[1m\x1b[32m✓\x1b[0m";
            case LogLevel.WARN:
                return "\x1b[1m\x1b[93m!\x1b[0m";
            case LogLevel.ERROR:
                return "\x1b[1m\x1b[31mX\x1b[0m";
            default:
                return "";
        }
    }
    trace(message) {
        if (this.level <= LogLevel.TRACE) {
            console.log(`${this.getEmoji(LogLevel.TRACE)} ${message}`);
        }
    }
    debug(message) {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`${this.getEmoji(LogLevel.DEBUG)} ${message}`);
        }
    }
    info(message) {
        if (this.level <= LogLevel.INFO) {
            console.info(`${this.getEmoji(LogLevel.INFO)} ${message}`);
        }
    }
    warn(message) {
        if (this.level <= LogLevel.WARN) {
            console.warn(`${this.getEmoji(LogLevel.WARN)} ${message}`);
        }
    }
    error(message) {
        if (this.level <= LogLevel.ERROR) {
            console.error(`${this.getEmoji(LogLevel.ERROR)} ${message}`);
        }
    }
}
exports.Logger = Logger;
//# sourceMappingURL=log.js.map