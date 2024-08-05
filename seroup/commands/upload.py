import io
import zipfile
from fnmatch import fnmatch
from pathlib import Path
from typing import Optional

import seroapi as api
from seroup.commands.base import Command
from seroup.configuration.config import Configuration


class UploadCommand(Command):
    @classmethod
    def name(cls) -> str:
        return "upload"

    @classmethod
    def help(cls) -> str:
        return "Upload site."

    def load_ignore_patterns_from_file(self, path: Path) -> list[str]:
        """
        The function reads a file at the specified path and returns a list of patterns excluding empty
        lines and lines starting with "#" symbol. It also strips any leading or trailing whitespace.
        """

        comment_symbol = "#"

        patterns = []

        # ? If path does not exist
        # ? we do not need to ignore anything
        if not path.exists():
            return patterns

        with open(path, "r") as file:
            for line in file:
                line = line.strip()

                if line and not line.startswith(comment_symbol):
                    patterns.append(line)

        return patterns

    def should_ignore(self, path: Path, patterns) -> bool:
        """
        The function `should_ignore` checks if a given path should be ignored based on a list of patterns.

        :param path: The `path` parameter is a Path object that represents a file or directory path in the file system. It is
        used as input to the `should_ignore` method to determine if the path should be ignored based on the provided patterns
        :type path: Path
        :param patterns: The `patterns` parameter is a list of strings that contain wildcard patterns used for matching file
        paths. These patterns are used in the `fnmatch` function to determine if a given file path should be ignored or not
        :return: The `should_ignore` function is returning a boolean value indicating whether the given `path` should be
        ignored based on the `patterns` provided.
        """

        return any(fnmatch(path, pattern) or fnmatch(path.name, pattern) for pattern in patterns)

    def execute(self, configuration: Optional[Configuration], **kwargs):
        # ? Get a directory to generate the configuration file in
        # ? or fallback to default
        default_directory = Path.cwd()
        default_ignore_filename = ".seroignore"
        path = kwargs.get("directory", default_directory)

        ignore_filepath = path.joinpath(default_ignore_filename)

        api_configuration = api.Configuration(host=configuration.server.url)

        # ? Authenticating user
        with api.ApiClient(api_configuration) as api_client:
            instance = api.AccountManagementApi(api_client)

            login = configuration.credentials.login
            password = configuration.credentials.password

            registration_request = api.LoginRequest(login=login, password=password)
            response = instance.login(registration_request)

            api_configuration.access_token = response.token

        with api.ApiClient(api_configuration) as api_client:
            instance = api.ActionsApi(api_client)

            ignore_patterns = self.load_ignore_patterns_from_file(ignore_filepath)

            # ? We should really care about sero.toml
            ignore_patterns.append("sero.toml")

            # ? Compressing to inmemory zip
            # ? excluding root directory
            # ? This also does not compress files which matches
            # ? patterns in .seroignore and sero.toml
            zip_buffer = io.BytesIO()

            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
                for file_path in path.glob("./**/*"):
                    if file_path.is_dir():
                        continue  # Skip directories

                    if self.should_ignore(file_path, ignore_patterns):
                        continue  # Skip ignored files

                    relative_path = file_path.relative_to(path)
                    zipf.write(file_path, relative_path)
            zip_buffer.seek(0)

            subdomain = configuration.server.subdomain
            instance.upload_site(x_subdomain=subdomain, archive=zip_buffer.read())
