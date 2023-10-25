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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.upload = exports.teardown = exports.disable = exports.register = exports.init = exports.enable = exports.process_error = exports.logger = exports.program = void 0;
const path = __importStar(require("path"));
const api_1 = require("./sero-api/api");
const log_1 = require("./log");
const fs_1 = require("fs");
const commander_1 = require("commander");
const sero_api_1 = require("./sero-api");
const config_1 = require("./config");
const error_1 = require("./error");
const crypto_1 = require("crypto");
const zip_a_folder_1 = require("zip-a-folder");
exports.program = new commander_1.Command();
exports.logger = new log_1.Logger(log_1.LogLevel.INFO);
function process_error(err) {
    exports.logger.error(err.message);
    process.exit(1);
}
exports.process_error = process_error;
const process_api_error = (error) => {
    if (error.response) {
        process_error(error_1.SeroError.from_string(error.response.data.details));
    }
    else if (error.request) {
        process_error(error_1.SeroError.from_string(error.cause.message));
    }
    else {
        process_error(error_1.SeroError.from_string(error.message));
    }
};
const enable = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    const opts = exports.program.opts();
    if (opts.level !== undefined) {
        exports.logger.setLevel(opts.level);
    }
    exports.logger.trace("Checking if directory was provided...");
    if (typeof directory !== "string") {
        exports.logger.trace("Directory was not provided! Defaulting to the current working directory aka .");
        directory = ".";
    }
    exports.logger.debug("Specified directory: " + directory);
    exports.logger.trace("Reading sero.toml file...");
    let config = config_1.SeroConfig.read(path.join(directory, "sero.toml"))
        .mapErr(process_error)
        ._unsafeUnwrap();
    exports.logger.trace("Config was successfully read!");
    exports.logger.debug(JSON.stringify(config));
    exports.logger.trace("Checking if password is set...");
    config.ask_password_if_missing();
    const configuration = new sero_api_1.Configuration({
        basePath: config.server.url.toString(),
    });
    const api = new api_1.DefaultApi(configuration);
    exports.logger.trace("Logging in...");
    let auth_token = yield api
        .apiLoginPost(config.credentials.username, config.credentials.password)
        .catch(process_api_error)
        .then((response) => response.data);
    configuration.accessToken = auth_token.token;
    exports.logger.trace("Logged in! JWT token was provided!");
    exports.logger.trace("Enabling....");
    yield api
        .apiEnablePost(config.server.subdomain)
        .catch(process_api_error)
        .then(() => exports.logger.info("Site was successfully enabled!"));
});
exports.enable = enable;
const init = (directory) => {
    const opts = exports.program.opts();
    if (opts.level !== undefined) {
        exports.logger.setLevel(opts.level);
    }
    exports.logger.trace("Checking if directory was provided...");
    if (typeof directory !== "string") {
        exports.logger.trace("Directory was not provided! Defaulting to the current working directory aka .");
        directory = ".";
    }
    if ((0, fs_1.existsSync)(path.join(directory, "sero.toml"))) {
        process_error(error_1.SeroError.from_string("Specified directory already contains sero.toml file!"));
    }
    exports.logger.debug("Specified directory: " + directory);
    exports.logger.trace("Generating default config...");
    let default_config = config_1.SeroConfig.default();
    exports.logger.debug("Default config " + JSON.stringify(default_config));
    exports.logger.trace("Saving default config in " + path.join(directory, "sero.toml"));
    default_config
        .save(path.join(directory, "sero.toml"))
        .mapErr(process_error)
        ._unsafeUnwrap();
    exports.logger.info("sero.toml file was successfully saved with a path " +
        path.join(directory, "sero.toml"));
};
exports.init = init;
const register = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    const opts = exports.program.opts();
    if (opts.level !== undefined) {
        exports.logger.setLevel(opts.level);
    }
    exports.logger.trace("Checking if directory was provided...");
    if (typeof directory !== "string") {
        exports.logger.trace("Directory was not provided! Defaulting to the current working directory aka .");
        directory = ".";
    }
    exports.logger.debug("Specified directory: " + directory);
    exports.logger.trace("Reading sero.toml file...");
    let config = config_1.SeroConfig.read(path.join(directory, "sero.toml"))
        .mapErr(process_error)
        ._unsafeUnwrap();
    exports.logger.trace("Config was successfully read!");
    exports.logger.debug(JSON.stringify(config));
    exports.logger.trace("Checking if password is set...");
    config.ask_password_if_missing();
    const configuration = new sero_api_1.Configuration({
        basePath: config.server.url.toString(),
    });
    const api = new api_1.DefaultApi(configuration);
    exports.logger.trace("Registering....");
    yield api
        .apiRegistrationPost(config.credentials.username, config.credentials.password)
        .catch(process_api_error)
        .then(() => exports.logger.info("User was successfully registered!"));
});
exports.register = register;
const disable = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    const opts = exports.program.opts();
    if (opts.level !== undefined) {
        exports.logger.setLevel(opts.level);
    }
    exports.logger.trace("Checking if directory was provided...");
    if (typeof directory !== "string") {
        exports.logger.trace("Directory was not provided! Defaulting to the current working directory aka .");
        directory = ".";
    }
    exports.logger.debug("Specified directory: " + directory);
    exports.logger.trace("Reading sero.toml file...");
    let config = config_1.SeroConfig.read(path.join(directory, "sero.toml"))
        .mapErr(process_error)
        ._unsafeUnwrap();
    exports.logger.trace("Config was successfully read!");
    exports.logger.debug(JSON.stringify(config));
    exports.logger.trace("Checking if password is set...");
    config.ask_password_if_missing();
    const configuration = new sero_api_1.Configuration({
        basePath: config.server.url.toString(),
    });
    const api = new api_1.DefaultApi(configuration);
    exports.logger.trace("Logging in...");
    let auth_token = yield api
        .apiLoginPost(config.credentials.username, config.credentials.password)
        .catch(process_api_error)
        .then((response) => response.data);
    configuration.accessToken = auth_token.token;
    exports.logger.trace("Logged in! JWT token was provided!");
    exports.logger.trace("Disabling....");
    yield api
        .apiDisablePost(config.server.subdomain)
        .catch(process_api_error)
        .then(() => exports.logger.info("Site was successfully disabled!"));
});
exports.disable = disable;
const teardown = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    const opts = exports.program.opts();
    if (opts.level !== undefined) {
        exports.logger.setLevel(opts.level);
    }
    exports.logger.trace("Checking if directory was provided...");
    if (typeof directory !== "string") {
        exports.logger.trace("Directory was not provided! Defaulting to the current working directory aka .");
        directory = ".";
    }
    exports.logger.debug("Specified directory: " + directory);
    exports.logger.trace("Reading sero.toml file...");
    let config = config_1.SeroConfig.read(path.join(directory, "sero.toml"))
        .mapErr(process_error)
        ._unsafeUnwrap();
    exports.logger.trace("Config was successfully read!");
    exports.logger.debug(JSON.stringify(config));
    exports.logger.trace("Checking if password is set...");
    config.ask_password_if_missing();
    const configuration = new sero_api_1.Configuration({
        basePath: config.server.url.toString(),
    });
    const api = new api_1.DefaultApi(configuration);
    exports.logger.trace("Logging in...");
    let auth_token = yield api
        .apiLoginPost(config.credentials.username, config.credentials.password)
        .catch(process_api_error)
        .then((response) => response.data);
    configuration.accessToken = auth_token.token;
    exports.logger.trace("Logged in! JWT token was provided!");
    exports.logger.trace("Deleting....");
    yield api
        .apiTeardownPost(config.server.subdomain)
        .catch(process_api_error)
        .then(() => exports.logger.info("Site was successfully deleted!"));
});
exports.teardown = teardown;
const upload = (directory) => __awaiter(void 0, void 0, void 0, function* () {
    const opts = exports.program.opts();
    if (opts.level !== undefined) {
        exports.logger.setLevel(opts.level);
    }
    exports.logger.trace("Checking if directory was provided...");
    if (typeof directory !== "string") {
        exports.logger.trace("Directory was not provided! Defaulting to the current working directory aka .");
        directory = ".";
    }
    exports.logger.debug("Specified directory: " + directory);
    exports.logger.trace("Reading sero.toml file...");
    let config = config_1.SeroConfig.read(path.join(directory, "sero.toml"))
        .mapErr(process_error)
        ._unsafeUnwrap();
    exports.logger.trace("Config was successfully read!");
    exports.logger.debug(JSON.stringify(config));
    exports.logger.trace("Checking if password is set...");
    config.ask_password_if_missing();
    const configuration = new sero_api_1.Configuration({
        basePath: config.server.url.toString(),
    });
    const api = new api_1.DefaultApi(configuration);
    exports.logger.trace("Logging in...");
    let auth_token = yield api
        .apiLoginPost(config.credentials.username, config.credentials.password)
        .catch(process_api_error)
        .then((response) => response.data);
    configuration.accessToken = auth_token.token;
    exports.logger.trace("Generating random name for zip file...");
    let zip_name = `./${(0, crypto_1.randomUUID)()}`;
    exports.logger.debug("zip file path: " + zip_name);
    if (!(0, fs_1.existsSync)(path.join(directory, "index.html"))) {
        exports.logger.warn("index.html file was not found in specified directory!");
    }
    exports.logger.trace("Zip " + directory + " to " + zip_name);
    yield (0, zip_a_folder_1.zip)(directory, zip_name).then(() => exports.logger.trace("Zip file was successfully generated"));
    exports.logger.trace("Reading contents of zip file: " + zip_name);
    let buffer = (0, fs_1.readFileSync)(zip_name);
    exports.logger.trace("Uploading...");
    let url = new URL(config.server.url);
    yield api
        .apiUploadPost(config.server.subdomain, new File([buffer], "archive"))
        .catch(process_api_error)
        .then(() => {
        exports.logger.trace("Removing zip file " + zip_name);
        (0, fs_1.unlinkSync)(zip_name);
        exports.logger.info("Site was successfully uploaded!");
        exports.logger.info(`Site is now available at ${url.protocol +
            "//" +
            config.server.subdomain +
            "." +
            url.host +
            "/index.html"}`);
    });
});
exports.upload = upload;
const download = (directory, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const opts = exports.program.opts();
    if (opts.level !== undefined) {
        exports.logger.setLevel(opts.level);
    }
    exports.logger.trace("Checking if directory was provided...");
    if (typeof directory !== "string") {
        exports.logger.trace("Directory was not provided! Defaulting to the current working directory aka .");
        directory = ".";
    }
    exports.logger.debug("Specified directory: " + directory);
    exports.logger.trace("Reading sero.toml file...");
    let config = config_1.SeroConfig.read(path.join(directory, "sero.toml"))
        .mapErr(process_error)
        ._unsafeUnwrap();
    exports.logger.trace("Config was successfully read!");
    exports.logger.debug(JSON.stringify(config));
    exports.logger.trace("Checking if password is set...");
    config.ask_password_if_missing();
    exports.logger.trace("Checking if destination was provided...");
    if (typeof destination !== "string") {
        destination = `./${config.server.subdomain}.zip`;
        exports.logger.trace("Destination was not provided! Defaulting to " + destination);
    }
    exports.logger.debug("Destination path: " + destination);
    exports.logger.trace("Checking that destination file does not exist...");
    if ((0, fs_1.existsSync)(destination)) {
        process_error(error_1.SeroError.from_string(`Destination file with path ${destination} already exists`));
    }
    const configuration = new sero_api_1.Configuration({
        basePath: config.server.url.toString(),
    });
    const api = new api_1.DefaultApi(configuration);
    exports.logger.trace("Logging in...");
    let auth_token = yield api
        .apiLoginPost(config.credentials.username, config.credentials.password)
        .catch(process_api_error)
        .then((response) => response.data);
    configuration.accessToken = auth_token.token;
    exports.logger.trace("Starting download...");
    let data = yield api
        .apiDownloadPost(config.server.subdomain, {
        responseEncoding: "binary",
    })
        .catch(process_api_error)
        .then((response) => {
        exports.logger.trace("File contents were downloaded!");
        return new Blob([response.data], { type: "application/zip" });
    });
    exports.logger.trace("Writing file contents to destination...");
    fs_1.promises
        .writeFile(destination, yield data.text(), { encoding: "binary" })
        .catch((error) => process_error(error_1.SeroError.from_string(error.message)))
        .then(() => exports.logger.info("Site was successfully downloaded and saved to " + destination));
});
exports.download = download;
//# sourceMappingURL=commands.js.map