from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.work_entry_photo import WorkEntryPhoto

class WorkEntryPhotoDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def create_photo(self, data: dict) -> WorkEntryPhoto:
        photo = WorkEntryPhoto(**data)
        self.db.add(photo)
        self.db.commit()
        self.db.refresh(photo)
        return photo


    def get_photo_by_id(self, photo_id: int) -> WorkEntryPhoto | None:
        result = self.db.execute(
            select(WorkEntryPhoto).where(WorkEntryPhoto.id == photo_id)
        )
        return result.scalar_one_or_none()

    def get_photos_by_work_entry(self, work_entry_id: int):
        result = self.db.execute(
            select(WorkEntryPhoto).where(
                WorkEntryPhoto.work_entry_id == work_entry_id
            )
        )
        return result.scalars().all()

    def delete_photo(self, photo: WorkEntryPhoto):
        self.db.delete(photo)
        self.db.commit()