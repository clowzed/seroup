from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, List, Self
import toml
import dacite
import getpass
import socket


@dataclass
class Server:
    url: str
    subdomain: str

    @classmethod
    def default(cls) -> Self:
        return Server(url="http://sero.com", subdomain=socket.gethostname())


@dataclass
class Cors:
    origins: List[str] = field(default_factory=list)

    @classmethod
    def default(cls) -> Self:
        return Cors(origins=[])


@dataclass
class Credentials:
    login: str
    password: Optional[str]

    @classmethod
    def default(cls) -> Self:
        return Credentials(login=socket.gethostname(), password="")


@dataclass
class Configuration:
    server: Server
    cors: Cors
    credentials: Credentials

    @classmethod
    def from_toml(cls, path: Path) -> Self:
        toml_file_contents: dict = toml.load(path)

        configuration = dacite.from_dict(Configuration, toml_file_contents)

        if not configuration.credentials.password:
            configuration.credentials.password = getpass.getpass()

        return configuration

    @classmethod
    def default(cls) -> Self:
        default_server_configuration = Server.default()
        default_cors_configuration = Cors.default()
        default_credentials_configuration = Credentials.default()

        default_configuration = Configuration(
            server=default_server_configuration,
            cors=default_cors_configuration,
            credentials=default_credentials_configuration,
        )

        return default_configuration
