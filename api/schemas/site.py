from pydantic import BaseModel, Field
from datetime import date


class CreateSiteRequest(BaseModel):
    client_id: int
    project_name: str = Field(min_length=1)
    location: str = Field(min_length=1)
    start_date: date
    duration_days: int | None = None

class SiteResponse(BaseModel):
    id: int
    project_name: str
    location: str
    status: str
    client_id: int
    duration_days: int | None
    start_date: date
    is_active: bool

    class Config:
        from_attributes = True