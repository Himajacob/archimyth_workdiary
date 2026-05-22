from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from database.models.user import User
from database.models.role import Role

class UserDataAccess:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, data: dict) -> User:
        user = User(**data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_user(self, user: User, data: dict) -> User:
        for key, value in data.items():
            setattr(user, key, value)

        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_user_by_id(self, user_id: int) -> User | None:
        result = self.db.execute(
            select(User).options(joinedload(User.role)).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    def get_user_by_email(self, email: str) -> User | None:
        result = self.db.execute(
            select(User).options(joinedload(User.role)).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    def get_active_users(self):
        result = self.db.execute(
            select(User)
            .join(Role, User.role_id == Role.id)
            .where(User.is_active == True, Role.name != "client")
        )
        return result.scalars().all()
    
    def activate_user(self, user: User):
        user.is_active = True
        self.db.commit()
        self.db.refresh(user)
        return user

    def deactivate_user(self, user: User):
        user.is_active = False
        self.db.commit()
        return user
    
    def get_user_by_invite_token(self, token: str) -> User | None:
        result = self.db.execute(
            select(User).options(joinedload(User.role)).where(User.invite_token == token)
        )
        return result.scalar_one_or_none()

    def get_all_users(self):
        result = self.db.execute(
            select(User)
            .options(joinedload(User.role))
            .join(Role, User.role_id == Role.id)
            .where(Role.name != "client")
        )
        return result.scalars().all()
    
    def get_user_by_client_id(self, client_id: int) -> User | None:
        result = self.db.execute(
            select(User).options(joinedload(User.role)).where(User.client_id == client_id)
        )
        return result.scalar_one_or_none()

    def count_active_admins(self) -> int:
        result = self.db.execute(
            select(User)
            .join(Role, User.role_id == Role.id)
            .where(
                Role.name.in_(["admin", "super_admin"]),
                User.is_active == True
            )
        )
        return len(result.scalars().all())
