from abc import ABC, abstractmethod
from typing import Optional
from seroup.configuration.config import Configuration


class Command(ABC):
    @classmethod
    @abstractmethod
    def name(cls) -> str:
        pass

    @classmethod
    @abstractmethod
    def help(cls) -> str:
        pass

    @abstractmethod
    def execute(self, configuration: Optional[Configuration], **kwargs) -> None:
        pass
