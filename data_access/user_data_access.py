from sqlalchemy.orm import Session
from sqlalchemy import select
from database.models.user import User

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
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    def get_user_by_email(self, email: str) -> User | None:
        result = self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    def get_active_users(self):
        result = self.db.execute(
            select(User).where(User.is_active == True)
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
        select(User).where(User.invite_token == token)
        )
        return result.scalar_one_or_none()
