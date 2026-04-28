from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError


class BaseDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def add(self, obj):
        self.db.add(obj)
        return obj

    def delete(self, obj):
        self.db.delete(obj)

    def refresh(self, obj):
        self.db.refresh(obj)
        return obj

    def flush(self):
        self.db.flush()

    def commit(self):
        try:
            self.db.commit()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise e