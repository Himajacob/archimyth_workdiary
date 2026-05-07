from pydantic import BaseModel, Field


class CreateWorkTypeRequest(BaseModel):
    name: str = Field(min_length=1)

class WorkTypeResponse(BaseModel):
    id: int
    name: str
    is_active: bool

    class Config:
        orm_mode = True


class WorkTypeListResponse(BaseModel):
    id: int
    name: str
    is_active: bool