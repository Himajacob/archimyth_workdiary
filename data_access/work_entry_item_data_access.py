from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.work_entry_item import WorkEntryItem


class WorkEntryItemDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def create_item(self, data: dict) -> WorkEntryItem:
        item = WorkEntryItem(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update_item(self, item: WorkEntryItem, data: dict) -> WorkEntryItem:
        for key, value in data.items():
            setattr(item, key, value)

        self.db.commit()
        self.db.refresh(item)
        return item

    def get_item_by_id(self, item_id: int) -> WorkEntryItem | None:
        result = self.db.execute(
            select(WorkEntryItem).where(WorkEntryItem.id == item_id)
        )
        return result.scalar_one_or_none()


    def get_items_by_work_entry(self, work_entry_id: int):
        result = self.db.execute(
            select(WorkEntryItem).where(
                WorkEntryItem.work_entry_id == work_entry_id
            )
        )
        return result.scalars().all()

    def delete_item(self, item: WorkEntryItem):
        self.db.delete(item)
        self.db.commit()
    
    def get_items_by_entry_id_and_work_type(self, entry_id: int, work_type_id):
        result = self.db.execute(
            select(WorkEntryItem).where(
            WorkEntryItem.work_entry_id == entry_id,
            WorkEntryItem.work_type_id == work_type_id
            ))
        return result.scalar_one_or_none()
    
    def get_null_work_type_item(self, entry_id: int):
        result = self.db.execute(
            select(WorkEntryItem).where(
            WorkEntryItem.work_entry_id == entry_id,
            WorkEntryItem.work_type_id.is_(None)
        ))
        return result.scalar_one_or_none()
    
    def delete_item_by_entry_id(self, entry_id: int):
        self.db.query(WorkEntryItem).filter(
            WorkEntryItem.work_entry_id == entry_id
        ).delete()

