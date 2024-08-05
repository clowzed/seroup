from pathlib import Path
from typing import Optional
from seroup.configuration.config import Configuration
from seroup.commands.base import Command
import seroapi as api


class DownloadCommand(Command):
    @classmethod
    def name(cls) -> str:
        return "download"

    @classmethod
    def help(cls) -> str:
        return "Download site."

    def execute(self, configuration: Optional[Configuration], **kwargs) -> None:
        # ? Get a directory to generate the configuration file in
        # ? or fallback to default
        default_directory = Path.cwd()
        path = kwargs.get("directory", default_directory)

        # ? Generate filepath for zip archive
        # ? which will be downloaded
        filename = path.joinpath(f"{configuration.server.subdomain}.zip")

        api_configuration = api.Configuration(host=configuration.server.url)

        # ? Authenticating user
        with api.ApiClient(api_configuration) as api_client:
            instance = api.AccountManagementApi(api_client)

            login = configuration.credentials.login
            password = configuration.credentials.password

            registration_request = api.LoginRequest(login=login, password=password)
            response = instance.login(registration_request)

            api_configuration.access_token = response.token

        # ? Call download action
        with api.ApiClient(api_configuration) as api_client:
            instance = api.ActionsApi(api_client)
            response = instance.download_site_without_preload_content(x_subdomain=configuration.server.subdomain)

            with open(filename, "wb") as f:
                f.write(response.read())
