from typing import Optional
from seroapi.models.add_origin_request import AddOriginRequest
from seroup.configuration.config import Configuration
from seroup.commands.base import Command
import seroapi as api


class UcorsCommand(Command):
    @classmethod
    def name(cls) -> str:
        return "ucors"

    @classmethod
    def help(cls) -> str:
        return "Update cors configuration."

    def execute(self, configuration: Optional[Configuration], **kwargs):
        api_configuration = api.Configuration(host=configuration.server.url)

        # ? Authenticating user
        with api.ApiClient(api_configuration) as api_client:
            instance = api.AccountManagementApi(api_client)

            login = configuration.credentials.login
            password = configuration.credentials.password

            registration_request = api.LoginRequest(login=login, password=password)
            response = instance.login(registration_request)

            api_configuration.access_token = response.token

        # ? Remove old cors and apply new
        with api.ApiClient(api_configuration) as api_client:
            instance = api.OriginsManagementAndDynamicAccessControlApi(api_client)

            # ? Remove old
            instance.delete_all_origins(x_subdomain=configuration.server.subdomain)

            # ? Apply new
            for origin in configuration.cors.origins:
                request = AddOriginRequest(origin)
                instance.create_origin(x_subdomain=configuration.server.subdomain, add_origin_request=request)
