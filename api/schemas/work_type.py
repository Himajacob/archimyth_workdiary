from pydantic import BaseModel, Field


class CreateWorkTypeRequest(BaseModel):
    name: str = Field(min_length=1)