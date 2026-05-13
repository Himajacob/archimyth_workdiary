from sqlalchemy.orm import Session
from sqlalchemy import select,desc
from database.models.work_entry import WorkEntry


class WorkEntryDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def create_work_entry(self, data: dict) -> WorkEntry:
        work_entry = WorkEntry(**data)
        self.db.add(work_entry)
        self.db.commit()
        self.db.refresh(work_entry)
        return work_entry

    def update_work_entry(self, work_entry: WorkEntry, data: dict) -> WorkEntry:
        for key, value in data.items():
            setattr(work_entry, key, value)

        self.db.commit()
        self.db.refresh(work_entry)
        return work_entry


    def get_work_entry_by_id(self, work_entry_id: int) -> WorkEntry | None:
        result = self.db.execute(
            select(WorkEntry).where(WorkEntry.id == work_entry_id)
        )
        return result.scalar_one_or_none()


    def get_by_site_and_date(self, site_id: int, entry_date):
        result = self.db.execute(
            select(WorkEntry).where(
                WorkEntry.site_id == site_id,
                WorkEntry.entry_date == entry_date
            )
        )
        return result.scalar_one_or_none()

    def get_entries_by_site(self, site_id: int):
        result = self.db.execute(
            select(WorkEntry)
            .where(WorkEntry.site_id == site_id)
            .order_by(desc(WorkEntry.entry_date))
        )
        return result.scalars().all()

    
    def delete_work_entry(self, work_entry: WorkEntry):
        self.db.delete(work_entry)
        self.db.commit()