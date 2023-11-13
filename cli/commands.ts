import * as path from "path";

import { AuthToken, DefaultApi } from "./sero-api/api";
import { Blob, File } from "@web-std/file"
import { LogLevel, Logger } from "./log";
import { existsSync, promises, readFileSync, unlink, unlinkSync } from "fs";

import { Command } from "commander";
import { Configuration } from "./sero-api";
import { SeroConfig } from "./config";
import { SeroError } from "./error";
import { randomUUID } from "crypto";
import { zip } from "zip-a-folder";

export const program = new Command();
export const logger = new Logger(LogLevel.INFO);

export function process_error<T extends Error>(err: T) {
  logger.error(err.message);
  process.exit(1);
}

const process_api_error = (error: any) => {
  console.log(error);
  if (error.response) {
    process_error(SeroError.from_string(error.response.data.details));
  } else if (error.request) {
    process_error(SeroError.from_string(error.cause.message));
  } else {
    process_error(SeroError.from_string(error.message));
  }
};

export const enable = async (directory: string | undefined) => {
  const opts = program.opts();
  if (opts.level !== undefined) {
    logger.setLevel(opts.level);
  }
  logger.trace("Checking if directory was provided...");
  if (typeof directory !== "string") {
    logger.trace(
      "Directory was not provided! Defaulting to the current working directory aka ."
    );
    directory = ".";
  }

  logger.debug("Specified directory: " + directory);

  logger.trace("Reading sero.toml file...");

  let config = SeroConfig.read(path.join(directory, "sero.toml"))
    .mapErr(process_error)
    ._unsafeUnwrap();

  logger.trace("Config was successfully read!");
  logger.debug(JSON.stringify(config));

  logger.trace("Checking if password is set...");
  config.ask_password_if_missing();

  const configuration = new Configuration({
    basePath: config.server.url.toString(),
  });

  const api = new DefaultApi(configuration);

  logger.trace("Logging in...");
  let auth_token: AuthToken = await api
    .apiLoginPost(config.credentials.username, config.credentials.password!)
    .catch(process_api_error)
    .then((response) => response!.data);
  configuration.accessToken = auth_token.token!;

  logger.trace("Logged in! JWT token was provided!");
  logger.trace("Enabling....");
  await api
    .apiEnablePost(config.server.subdomain)
    .catch(process_api_error)
    .then(() => logger.info("Site was successfully enabled!"));
};

export const init = (directory: string | undefined) => {
  const opts = program.opts();
  if (opts.level !== undefined) {
    logger.setLevel(opts.level);
  }
  logger.trace("Checking if directory was provided...");
  if (typeof directory !== "string") {
    logger.trace(
      "Directory was not provided! Defaulting to the current working directory aka ."
    );
    directory = ".";
  }

  if (existsSync(path.join(directory, "sero.toml"))) {
    process_error(
      SeroError.from_string(
        "Specified directory already contains sero.toml file!"
      )
    );
  }

  logger.debug("Specified directory: " + directory);

  logger.trace("Generating default config...");
  let default_config = SeroConfig.default();
  logger.debug("Default config " + JSON.stringify(default_config));

  logger.trace("Saving default config in " + path.join(directory, "sero.toml"));

  default_config
    .save(path.join(directory, "sero.toml"))
    .mapErr(process_error)
    ._unsafeUnwrap();
  logger.info(
    "sero.toml file was successfully saved with a path " +
      path.join(directory, "sero.toml")
  );
};

export const register = async (directory: string | undefined) => {
  const opts = program.opts();
  if (opts.level !== undefined) {
    logger.setLevel(opts.level);
  }
  logger.trace("Checking if directory was provided...");
  if (typeof directory !== "string") {
    logger.trace(
      "Directory was not provided! Defaulting to the current working directory aka ."
    );
    directory = ".";
  }

  logger.debug("Specified directory: " + directory);

  logger.trace("Reading sero.toml file...");

  let config = SeroConfig.read(path.join(directory, "sero.toml"))
    .mapErr(process_error)
    ._unsafeUnwrap();

  logger.trace("Config was successfully read!");
  logger.debug(JSON.stringify(config));

  logger.trace("Checking if password is set...");
  config.ask_password_if_missing();

  const configuration = new Configuration({
    basePath: config.server.url.toString(),
  });

  const api = new DefaultApi(configuration);

  logger.trace("Registering....");
  await api
    .apiRegistrationPost(
      config.credentials.username,
      config.credentials.password!,
      {withCredentials: false}
    )
    .catch(process_api_error)
    .then(() => logger.info("User was successfully registered!"));
};

export const disable = async (directory: string | undefined) => {
  const opts = program.opts();
  if (opts.level !== undefined) {
    logger.setLevel(opts.level);
  }
  logger.trace("Checking if directory was provided...");
  if (typeof directory !== "string") {
    logger.trace(
      "Directory was not provided! Defaulting to the current working directory aka ."
    );
    directory = ".";
  }

  logger.debug("Specified directory: " + directory);

  logger.trace("Reading sero.toml file...");

  let config = SeroConfig.read(path.join(directory, "sero.toml"))
    .mapErr(process_error)
    ._unsafeUnwrap();

  logger.trace("Config was successfully read!");
  logger.debug(JSON.stringify(config));

  logger.trace("Checking if password is set...");
  config.ask_password_if_missing();

  const configuration = new Configuration({
    basePath: config.server.url.toString(),
  });

  const api = new DefaultApi(configuration);

  logger.trace("Logging in...");
  let auth_token: AuthToken = await api
    .apiLoginPost(config.credentials.username, config.credentials.password!)
    .catch(process_api_error)
    .then((response) => response!.data);
  configuration.accessToken = auth_token.token!;

  logger.trace("Logged in! JWT token was provided!");
  logger.trace("Disabling....");
  await api
    .apiDisablePost(config.server.subdomain)
    .catch(process_api_error)
    .then(() => logger.info("Site was successfully disabled!"));
};

export const teardown = async (directory: string | undefined) => {
  const opts = program.opts();
  if (opts.level !== undefined) {
    logger.setLevel(opts.level);
  }
  logger.trace("Checking if directory was provided...");
  if (typeof directory !== "string") {
    logger.trace(
      "Directory was not provided! Defaulting to the current working directory aka ."
    );
    directory = ".";
  }

  logger.debug("Specified directory: " + directory);

  logger.trace("Reading sero.toml file...");

  let config = SeroConfig.read(path.join(directory, "sero.toml"))
    .mapErr(process_error)
    ._unsafeUnwrap();

  logger.trace("Config was successfully read!");
  logger.debug(JSON.stringify(config));

  logger.trace("Checking if password is set...");
  config.ask_password_if_missing();

  const configuration = new Configuration({
    basePath: config.server.url.toString(),
  });

  const api = new DefaultApi(configuration);

  logger.trace("Logging in...");
  let auth_token: AuthToken = await api
    .apiLoginPost(config.credentials.username, config.credentials.password!)
    .catch(process_api_error)
    .then((response) => response!.data);
  configuration.accessToken = auth_token.token!;

  logger.trace("Logged in! JWT token was provided!");
  logger.trace("Deleting....");
  await api
    .apiTeardownPost(config.server.subdomain)
    .catch(process_api_error)
    .then(() => logger.info("Site was successfully deleted!"));
};

export const upload = async (directory: string | undefined) => {
  const opts = program.opts();
  if (opts.level !== undefined) {
    logger.setLevel(opts.level);
  }
  logger.trace("Checking if directory was provided...");
  if (typeof directory !== "string") {
    logger.trace(
      "Directory was not provided! Defaulting to the current working directory aka ."
    );
    directory = ".";
  }

  logger.debug("Specified directory: " + directory);

  logger.trace("Reading sero.toml file...");

  let config = SeroConfig.read(path.join(directory, "sero.toml"))
    .mapErr(process_error)
    ._unsafeUnwrap();

  logger.trace("Config was successfully read!");
  logger.debug(JSON.stringify(config));

  logger.trace("Checking if password is set...");
  config.ask_password_if_missing();
  const configuration = new Configuration({
    basePath: config.server.url.toString(),
  });
  const api = new DefaultApi(configuration);
  logger.trace("Logging in...");
  let auth_token: AuthToken = await api
    .apiLoginPost(config.credentials.username, config.credentials.password!)
    .catch(process_api_error)
    .then((response) => response!.data);
  configuration.accessToken = auth_token.token!;

  logger.trace("Generating random name for zip file...");
  let zip_name = `./${randomUUID()}`;
  logger.debug("zip file path: " + zip_name);

  if (!existsSync(path.join(directory, "index.html"))) {
    logger.warn("index.html file was not found in specified directory!");
  }

  logger.trace("Zip " + directory + " to " + zip_name);
  await zip(directory, zip_name).then(() =>
    logger.trace("Zip file was successfully generated")
  );

  logger.trace("Reading contents of zip file: " + zip_name);
  let buffer = readFileSync(zip_name);

  logger.trace("Uploading...");

  let url = new URL(config.server.url);

  await api
    .apiUploadPost(config.server.subdomain, new File([buffer], "archive"))
    .catch(process_api_error)
    .then(() => {
      logger.trace("Removing zip file " + zip_name);
      unlinkSync(zip_name);
      logger.info("Site was successfully uploaded!");
    }).then(async () => {
        if (config.cors.origins !== undefined !== null) { 
        for (const origin of config.cors.origins!){
            logger.trace("Adding origin " + origin);
            await api.apiCorsAddPost(config.server.subdomain, origin).catch(process_api_error)
        }}
        logger.debug("Cors origins were successfully applied!");
    })
    .then(() => {
        logger.info(
            `Site is now available at ${
              url.protocol +
              "//" +
              config.server.subdomain +
              "." +
              url.host +
              "/index.html"
            }`
          );
    });
};

export const download = async (
  directory: string | undefined,
  destination: string | undefined
) => {
  const opts = program.opts();
  if (opts.level !== undefined) {
    logger.setLevel(opts.level);
  }
  logger.trace("Checking if directory was provided...");
  if (typeof directory !== "string") {
    logger.trace(
      "Directory was not provided! Defaulting to the current working directory aka ."
    );
    directory = ".";
  }

  logger.debug("Specified directory: " + directory);

  logger.trace("Reading sero.toml file...");

  let config = SeroConfig.read(path.join(directory, "sero.toml"))
    .mapErr(process_error)
    ._unsafeUnwrap();

  logger.trace("Config was successfully read!");
  logger.debug(JSON.stringify(config));

  logger.trace("Checking if password is set...");
  config.ask_password_if_missing();

  logger.trace("Checking if destination was provided...");
  if (typeof destination !== "string") {
    destination = `./${config.server.subdomain}.zip`;
    logger.trace("Destination was not provided! Defaulting to " + destination);
  }

  logger.debug("Destination path: " + destination);

  logger.trace("Checking that destination file does not exist...");
  if (existsSync(destination)) {
    process_error(
      SeroError.from_string(
        `Destination file with path ${destination} already exists`
      )
    );
  }

  const configuration = new Configuration({
    basePath: config.server.url.toString(),
  });
  const api = new DefaultApi(configuration);
  logger.trace("Logging in...");
  let auth_token: AuthToken = await api
    .apiLoginPost(config.credentials.username, config.credentials.password!)
    .catch(process_api_error)
    .then((response) => response!.data);
  configuration.accessToken = auth_token.token!;

  logger.trace("Starting download...");
  let data = await api
    .apiDownloadPost(config.server.subdomain, {
      responseEncoding: "binary",
    })
    .catch(process_api_error)
    .then((response) => {
      logger.trace("File contents were downloaded!");
      return new Blob([response!.data], { type: "application/zip" });
    });
  logger.trace("Writing file contents to destination...");
  promises
    .writeFile(destination, await data.text(), { encoding: "binary" })
    .catch((error) => process_error(SeroError.from_string(error.message)))
    .then(() =>
      logger.info(
        "Site was successfully downloaded and saved to " + destination
      )
    );
};
