from typing import Optional
from seroup.configuration.config import Configuration
from seroup.commands.base import Command
import seroapi as api


class TeardownCommand(Command):
    @classmethod
    def name(cls) -> str:
        return "teardown"

    @classmethod
    def help(cls) -> str:
        return "Teardown site."

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

        # ? Call teardown action
        with api.ApiClient(api_configuration) as api_client:
            instance = api.ActionsApi(api_client)
            instance.teardown_site(x_subdomain=configuration.server.subdomain)
