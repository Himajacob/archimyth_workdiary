from pydantic import BaseModel, Field


class CreateClientRequest(BaseModel):
    name: str = Field(min_length=1)
    contact_number: str = Field(min_length=5)
    address: str | None = None