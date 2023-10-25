#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("./commands");
const log_1 = require("./log");
function main() {
    commands_1.program
        .command("init [directory]")
        .description("Create default sero.toml in the specified directory")
        .action(commands_1.init);
    commands_1.program
        .command("enable [directory]")
        .description("Enable site from specified directory")
        .action(commands_1.enable);
    commands_1.program
        .command("disable [directory]")
        .description("Disable site from specified directory")
        .action(commands_1.disable);
    commands_1.program
        .command("teardown [directory]")
        .description("Delete site. Subdomain wil be freed")
        .action(commands_1.teardown);
    commands_1.program
        .command("register [directory]")
        .description("Register user from sero.toml")
        .action(commands_1.register);
    commands_1.program
        .command("download [directory] [destination]")
        .description("Download site from specified directory")
        .action(commands_1.download);
    commands_1.program
        .command("upload [directory]")
        .description("Upload site from specified directory")
        .action(commands_1.upload);
    commands_1.program.option("-l, --level <level>", "set log level", log_1.getLogLevel);
    commands_1.program.parse(process.argv);
}
main();
//# sourceMappingURL=run.js.map