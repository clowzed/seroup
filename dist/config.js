"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeroConfig = exports.Server = exports.Cors = exports.Credentials = void 0;
const TOML = __importStar(require("@iarna/toml"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const ts_json_validator_1 = require("ts-json-validator");
const neverthrow_1 = require("neverthrow");
const error_1 = require("./error");
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const parser = new ts_json_validator_1.TsjsonParser((0, ts_json_validator_1.createSchema)({
    type: "object",
    properties: {
        credentials: (0, ts_json_validator_1.createSchema)({
            type: "object",
            properties: {
                username: (0, ts_json_validator_1.createSchema)({ type: "string" }),
                password: (0, ts_json_validator_1.createSchema)({ type: "string" }),
            },
            required: ["username"],
        }),
        server: (0, ts_json_validator_1.createSchema)({
            type: "object",
            properties: {
                url: (0, ts_json_validator_1.createSchema)({ type: "string" }),
                subdomain: (0, ts_json_validator_1.createSchema)({ type: "string" }),
            },
            required: ["url", "subdomain"],
        }),
        cors: (0, ts_json_validator_1.createSchema)({
            type: "object",
            properties: {
                url: (0, ts_json_validator_1.createSchema)({ type: "array" }),
            },
        }),
    },
    required: ["credentials", "server"],
}));
class Credentials {
    static default() {
        return new Credentials(os.hostname(), "");
    }
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
exports.Credentials = Credentials;
class Cors {
    static default() {
        return new Cors([]);
    }
    constructor(origins) {
        this.origins = origins;
    }
}
exports.Cors = Cors;
class Server {
    constructor(url, subdomain) {
        this.url = url;
        this.subdomain = subdomain;
    }
    static default() {
        return new Server(new URL("http://sero.com"), os.hostname());
    }
}
exports.Server = Server;
class SeroConfig {
    ask_password_if_missing() {
        if (typeof this.credentials.password !== "string" ||
            !this.credentials.password.length) {
            const prompt = (0, prompt_sync_1.default)({ sigint: true });
            this.credentials.password = prompt("Enter password: ", {
                echo: "*",
            });
        }
    }
    constructor(credentials, server, cors) {
        this.credentials = credentials;
        this.server = server;
        this.cors = cors;
    }
    static default() {
        return new SeroConfig(Credentials.default(), Server.default(), Cors.default());
    }
    save(path) {
        const safe_save = neverthrow_1.Result.fromThrowable(fs.writeFileSync, error_1.SeroError.newfrom);
        return safe_save(path, TOML.stringify(JSON.parse(JSON.stringify(this))));
    }
    static read(path) {
        const read_sero_toml_contents_safe = neverthrow_1.Result.fromThrowable(fs.readFileSync, error_1.SeroError.newfrom);
        const parse_sero_toml_contents_safe = neverthrow_1.Result.fromThrowable(TOML.parse, error_1.SeroError.newfrom);
        const parse_sero_toml_according_to_schema = neverthrow_1.Result.fromThrowable(parser.parse, error_1.SeroError.newfrom);
        const assign_safe = neverthrow_1.Result.fromThrowable((obj) => Object.assign(SeroConfig.default(), obj), error_1.SeroError.newfrom);
        const safe_stringify = neverthrow_1.Result.fromThrowable(JSON.stringify, error_1.SeroError.newfrom);
        return read_sero_toml_contents_safe(path)
            .andThen((contents) => parse_sero_toml_contents_safe(contents.toString()))
            .andThen((parsed) => safe_stringify(parsed))
            .andThen((stringified) => parse_sero_toml_according_to_schema(stringified))
            .andThen((obj) => assign_safe(obj));
    }
}
exports.SeroConfig = SeroConfig;
//# sourceMappingURL=config.js.map