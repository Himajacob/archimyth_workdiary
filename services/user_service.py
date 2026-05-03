import secrets
import re
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from database.models.user import User
from data_access.user_data_access import UserDataAccess

from core.roles import Roles
from core.security import hash_password, verify_password

from core.email import send_invite_email
class UserService:
    def __init__(self, db: Session):
        self.db = db
        self.user_da = UserDataAccess(db)
    
    def invite_user(self, admin_user: User, data: dict) -> User:
        if admin_user.role != Roles.ADMIN:
            raise PermissionError("Only admins can invite users")
        
        self._validate_invite_data(data)
        existing_user = self.user_da.get_user_by_email(data["email"])

        if existing_user:
            raise ValueError("User with this email already exists")

        token = secrets.token_urlsafe(32)

        user_data = {
            "first_name": data.get("first_name"),
            "last_name": data.get("last_name"),
            "email": data["email"],
            "role": data["role"],
            "created_by": admin_user.id,
            "password_hash": None,
            "invite_token": token,
            "invite_token_expiry": datetime.utcnow() + timedelta(days=2),
            "is_active": False,
            "is_invited": True
        }

        user = self.user_da.create_user(user_data)
        send_invite_email(user.email, token)
        return user
    
    def register_user(self, token: str, password: str) -> User:
        user = self.user_da.get_user_by_invite_token(token)

        if not user:
            raise ValueError("Invalid invite token")

        if user.invite_token_expiry < datetime.utcnow():
            raise ValueError("Invite token expired")

        if user.password_hash:
            raise ValueError("User already registered")

        hashed_password = hash_password(password)

        update_data = {
            "password_hash": hashed_password,
            "invite_token": None,
            "invite_token_expiry": None,
            "is_active": True,
            "is_invited": False
        }

        return self.user_da.update_user(user, update_data)

   
    def _validate_invite_data(self, data: dict):
        if "email" not in data or not data["email"]:
            raise ValueError("Email is required")

        if not re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", data["email"]):
            raise ValueError("Invalid email format")

        if data.get("first_name") is not None and not data["first_name"].strip():
            raise ValueError("First name cannot be empty")

        if data.get("last_name") is not None and not data["last_name"].strip():
            raise ValueError("Last name cannot be empty")

        if "role" not in data or data["role"] not in Roles.ALL:
            raise ValueError("Invalid role")
    
    def authenticate_user(self, email: str, password: str) -> User:
        user = self.user_da.get_user_by_email(email)

        if not user or not user.password_hash:
            raise ValueError("Invalid credentials")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid credentials")

        if not user.is_active:
            raise ValueError("User is inactive")

        return user

