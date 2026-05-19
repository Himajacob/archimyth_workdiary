from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.role import Role


class RoleDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def get_role_by_id(self, role_id: int) -> Role | None:
        result = self.db.execute(
            select(Role).where(Role.id == role_id)
        )
        return result.scalar_one_or_none()

    def get_role_by_name(self, name: str) -> Role | None:
        result = self.db.execute(
            select(Role).where(Role.name == name)
        )
        return result.scalar_one_or_none()

    def get_all_roles(self) -> list[Role]:
        result = self.db.execute(select(Role))
        return result.scalars().all()
