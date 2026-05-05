from pydantic import BaseModel


class WorkEntryPhotoResponse(BaseModel):
    id: int
    file_url: str

    class Config:
        from_attributes = True