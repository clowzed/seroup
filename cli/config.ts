import * as TOML from "@iarna/toml";
import * as fs from "fs";
import * as os from "os";

import { createSchema as S, TsjsonParser, Validated } from "ts-json-validator";

import { Result } from "neverthrow";
import { SeroError } from "./error";
import promptSync from "prompt-sync";

const parser = new TsjsonParser(
  S({
    type: "object",
    properties: {
      credentials: S({
        type: "object",
        properties: {
          username: S({ type: "string" }),
          password: S({ type: "string" }),
        },
        required: ["username"],
      }),
      server: S({
        type: "object",
        properties: {
          url: S({ type: "string" }),
          subdomain: S({ type: "string" }),
        },
        required: ["url", "subdomain"],
      }),
      cors: S({
        type: "object",
        properties: {
          url: S({ type: "array" }),
        },
      }),
    },
    required: ["credentials", "server"],
  })
);

export class Credentials {
  static default(): Credentials {
    return new Credentials(os.hostname(), "");
  }
  username: string;
  password: string | null | undefined;

  constructor(username: string, password: string | null | undefined) {
    this.username = username;
    this.password = password;
  }
}

export class Cors {
  static default(): Cors {
    return new Cors([]);
  }
  origins: string[] | null | undefined;

  constructor(origins: string[]) {
    this.origins = origins;
  }
}

export class Server {
  url: URL;
  subdomain: string;
  constructor(url: URL, subdomain: string) {
    this.url = url;
    this.subdomain = subdomain;
  }
  static default(): Server {
    return new Server(new URL("http://sero.com"), os.hostname());
  }
}

export class SeroConfig {
  ask_password_if_missing() {
    if (
      typeof this.credentials.password !== "string" ||
      !this.credentials.password.length
    ) {
      const prompt = promptSync({ sigint: true });
      this.credentials.password = prompt("Enter password: ", {
        echo: "*",
      });
    }
  }
  credentials: Credentials;
  server: Server;
  cors: Cors;

  constructor(credentials: Credentials, server: Server, cors: Cors) {
    this.credentials = credentials;
    this.server = server;
    this.cors = cors;
  }

  static default(): SeroConfig {
    return new SeroConfig(
      Credentials.default(),
      Server.default(),
      Cors.default()
    );
  }

  save(path: string): Result<void, SeroError> {
    const safe_save = Result.fromThrowable(fs.writeFileSync, SeroError.newfrom);

    return safe_save(path, TOML.stringify(JSON.parse(JSON.stringify(this))));
  }

  static read(path: string): Result<SeroConfig, SeroError> {
    const read_sero_toml_contents_safe = Result.fromThrowable(
      fs.readFileSync,
      SeroError.newfrom
    );
    const parse_sero_toml_contents_safe = Result.fromThrowable(
      TOML.parse,
      SeroError.newfrom
    );
    const parse_sero_toml_according_to_schema = Result.fromThrowable(
      parser.parse,
      SeroError.newfrom
    );

    const assign_safe = Result.fromThrowable(
      (obj) => Object.assign(SeroConfig.default(), obj),
      SeroError.newfrom
    );

    const safe_stringify = Result.fromThrowable(
      JSON.stringify,
      SeroError.newfrom
    );

    return read_sero_toml_contents_safe(path)
      .andThen((contents) => parse_sero_toml_contents_safe(contents.toString()))
      .andThen((parsed) => safe_stringify(parsed))
      .andThen((stringified) =>
        parse_sero_toml_according_to_schema(stringified)
      )
      .andThen((obj) => assign_safe(obj));
  }
}
