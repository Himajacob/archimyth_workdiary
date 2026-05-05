from pydantic import BaseModel
from datetime import date

class WorkEntryItemRequest(BaseModel):
    work_type_id: int | None
    workers_count: int
    remarks: str | None = None


class CreateWorkEntryRequest(BaseModel):
    site_id: int
    entry_date: date
    items: list[WorkEntryItemRequest]


class WorkEntryItemResponse(BaseModel):
    id: int
    work_type_id: int | None
    workers_count: int
    remarks: str | None

    class Config:
        from_attributes = True  

class WorkEntryResponse(BaseModel):
    id: int
    site_id: int
    entry_date: date
    items: list[WorkEntryItemResponse]

    class Config:
        from_attributes = True