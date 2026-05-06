from pydantic import BaseModel


class WorkEntryPhotoResponse(BaseModel):
    id: int
    photo_url: str

    class Config:
        from_attributes = True