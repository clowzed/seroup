from seroup.commands.init import InitCommand
from seroup.commands.enable import EnableCommand
from seroup.commands.disable import DisableCommand
from seroup.commands.download import DownloadCommand
from seroup.commands.upload import UploadCommand
from seroup.commands.teardown import TeardownCommand
from seroup.commands.ucors import UcorsCommand
from seroup.configuration.config import Configuration
import argparse
from pathlib import Path
from seroup.commands.registration import RegistrationCommand


def main():
    default_path = Path.cwd()
    default_configuration_file_stem = "sero.toml"

    parser = argparse.ArgumentParser(description="Manage sero servers.")

    # * Adding commands to argparse
    subparsers = parser.add_subparsers(dest="command", required=True, help="Command to run")

    all_commands = [
        RegistrationCommand,
        InitCommand,
        UcorsCommand,
        EnableCommand,
        DisableCommand,
        DownloadCommand,
        TeardownCommand,
        UploadCommand,
    ]

    for command in all_commands:
        subparser = subparsers.add_parser(command.name(), help=command.help())
        subparser.add_argument(
            "path", type=Path, nargs="?", default=default_path, help="Path to process (default: current directory)"
        )

    args = parser.parse_args()

    # * Safe as we trust argparse
    # * Only one will match
    command = set(filter(lambda c: c.name() == args.command, all_commands)).pop()

    # * If command does not require configuration file
    # * execute it earlier
    commands_which_do_not_require_configuration_file = [InitCommand]

    if command in commands_which_do_not_require_configuration_file:
        # * None as we do not require configuration file
        command().execute(configuration=None, **args.__dict__)
        return  # ? Just to avoid nesting

    # * Reading configuration
    configuration_file = args.path.joinpath(default_configuration_file_stem)

    configuration = Configuration.from_toml(configuration_file)

    command().execute(configuration)
