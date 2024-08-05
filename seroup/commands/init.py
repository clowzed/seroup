from pathlib import Path
from typing import Optional
from seroup.configuration.config import Configuration
from seroup.commands.base import Command
from dataclasses import asdict
import toml


class InitCommand(Command):
    @classmethod
    def name(cls) -> str:
        return "init"

    @classmethod
    def help(cls) -> str:
        return "Creates default sero.toml in specified directory."

    def execute(self, configuration: Optional[Configuration], **kwargs) -> None:
        # ? Get a directory to generate the configuration file in
        # ? or fallback to default
        default_directory = Path.cwd()
        path = kwargs.get("directory", default_directory)

        # ? Generating configuration file path and checking
        # ? if this file already exists
        filepath = path.joinpath("sero.toml")

        if filepath.exists():
            return

        with open(filepath, "w") as file:
            file.write(toml.dumps(asdict(Configuration.default())))
