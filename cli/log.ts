export enum LogLevel {
    TRACE = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
}

export function getLogLevel(level: string): LogLevel {
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

export class Logger {
    private level: LogLevel;

    constructor(level: LogLevel) {
        this.level = level;
    }

    setLevel(level: LogLevel) {
        this.level = level;
    }
    private getEmoji(level: LogLevel): string {
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
    trace(message: string): void {
        if (this.level <= LogLevel.TRACE) {
            console.log(`${this.getEmoji(LogLevel.TRACE)} ${message}`);
        }
    }

    debug(message: string): void {
        if (this.level <= LogLevel.DEBUG) {
            console.debug(`${this.getEmoji(LogLevel.DEBUG)} ${message}`);
        }
    }

    info(message: string): void {
        if (this.level <= LogLevel.INFO) {
            console.info(`${this.getEmoji(LogLevel.INFO)} ${message}`);
        }
    }

    warn(message: string): void {
        if (this.level <= LogLevel.WARN) {
            console.warn(`${this.getEmoji(LogLevel.WARN)} ${message}`);
        }
    }

    error(message: string): void {
        if (this.level <= LogLevel.ERROR) {
            console.error(`${this.getEmoji(LogLevel.ERROR)} ${message}`);
        }
    }
}
