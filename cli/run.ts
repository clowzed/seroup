#! /usr/bin/env node

import {
    disable,
    download,
    enable,
    init,
    program,
    register,
    teardown,
    upload,
} from "./commands";

import { getLogLevel } from "./log";

function main() {
    program
        .command("init [directory]")
        .description("Create default sero.toml in the specified directory")
        .action(init);

    program
        .command("enable [directory]")
        .description("Enable site from specified directory")
        .action(enable);

    program
        .command("disable [directory]")
        .description("Disable site from specified directory")
        .action(disable);

    program
        .command("teardown [directory]")
        .description("Delete site. Subdomain wil be freed")
        .action(teardown);

    program
        .command("register [directory]")
        .description("Register user from sero.toml")
        .action(register);

    program
        .command("download [directory] [destination]")
        .description("Download site from specified directory")
        .action(download);
    program
        .command("upload [directory]")
        .description("Upload site from specified directory")
        .action(upload);

    program.option("-l, --level <level>", "set log level", getLogLevel);
    program.parse(process.argv);
}

main();
