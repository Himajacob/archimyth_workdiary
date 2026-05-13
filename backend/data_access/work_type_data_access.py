from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.work_type import WorkType


class WorkTypeDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def create_work_type(self, data: dict) -> WorkType:
        work_type = WorkType(**data)
        self.db.add(work_type)
        self.db.commit()
        self.db.refresh(work_type)
        return work_type

    def update_work_type(self, work_type: WorkType, data: dict) -> WorkType:
        for key, value in data.items():
            setattr(work_type, key, value)

        self.db.commit()
        self.db.refresh(work_type)
        return work_type


    def get_work_type_by_id(self, work_type_id: int) -> WorkType | None:
        result = self.db.execute(
            select(WorkType).where(WorkType.id == work_type_id)
        )
        return result.scalar_one_or_none()


    def get_work_type_by_name(self, name: str) -> WorkType | None:
        result = self.db.execute(
            select(WorkType).where(WorkType.name == name)
        )
        return result.scalar_one_or_none()


    def get_all_work_types(self):
        result = self.db.execute(select(WorkType))
        return result.scalars().all()

 
    def get_active_work_types(self):
        result = self.db.execute(
            select(WorkType).where(WorkType.is_active == True)
        )
        return result.scalars().all()


    def activate_work_type(self, work_type: WorkType):
        work_type.is_active = True
        self.db.commit()
        self.db.refresh(work_type)
        return work_type


    def deactivate_work_type(self, work_type: WorkType):
        work_type.is_active = False
        self.db.commit()
        return work_type