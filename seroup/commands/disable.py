from typing import Optional
from seroup.configuration.config import Configuration
from seroup.commands.base import Command
import seroapi as api


class DisableCommand(Command):
    @classmethod
    def name(cls) -> str:
        return "disable"

    @classmethod
    def help(cls) -> str:
        return "Disables site."

    def execute(self, configuration: Optional[Configuration], **kwargs) -> None:
        api_configuration = api.Configuration(host=configuration.server.url)

        # ? Authenticating user
        with api.ApiClient(api_configuration) as api_client:
            instance = api.AccountManagementApi(api_client)

            login = configuration.credentials.login
            password = configuration.credentials.password

            registration_request = api.LoginRequest(login=login, password=password)
            response = instance.login(registration_request)

            api_configuration.access_token = response.token

        # ? Call disable action
        with api.ApiClient(api_configuration) as api_client:
            instance = api.ActionsApi(api_client)
            instance.disable_site(x_subdomain=configuration.server.subdomain)
