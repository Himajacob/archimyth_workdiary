from pydantic import BaseModel, Field
from datetime import date


class CreateSiteRequest(BaseModel):
    client_id: int
    project_name: str = Field(min_length=1)
    location: str = Field(min_length=1)
    start_date: date
    duration_days: int | None = None