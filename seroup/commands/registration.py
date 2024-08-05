from typing import Optional
from seroup.configuration.config import Configuration
from seroup.commands.base import Command
import seroapi as api


class RegistrationCommand(Command):
    @classmethod
    def name(cls) -> str:
        return "registration"

    @classmethod
    def help(cls) -> str:
        return "Register user in sero server."

    def execute(self, configuration: Optional[Configuration], **kwargs) -> None:
        api_configuration = api.Configuration(host=configuration.server.url)

        with api.ApiClient(api_configuration) as api_client:
            instance = api.AccountManagementApi(api_client)

            login = configuration.credentials.login
            password = configuration.credentials.password

            registration_request = api.RegistrationRequest(login=login, password=password)
            instance.registration(registration_request)
