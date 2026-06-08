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

class WorkEntryPhotoResponse(BaseModel):
    id: int
    photo_url: str

    class Config:
        from_attributes = True

class WorkEntryItemResponse(BaseModel):
    id: int
    work_type_id: int | None
    workers_count: int
    remarks: str | None
    photos: list[WorkEntryPhotoResponse] = []

    class Config:
        from_attributes = True

class WorkEntryResponse(BaseModel):
    id: int
    site_id: int
    entry_date: date
    items: list[WorkEntryItemResponse]
    created_by_name: str | None = None
    updated_by_name: str | None = None

    class Config:
        from_attributes = True


class HistoryItemResponse(BaseModel):
    id: int
    work_type_id: int | None
    work_type_name: str | None
    workers_count: int
    remarks: str | None


class HistoryEntryResponse(BaseModel):
    entry_date: date
    updated_by_name: str | None = None
    items: list[HistoryItemResponse]