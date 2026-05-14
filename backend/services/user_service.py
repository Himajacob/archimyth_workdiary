import secrets
import re
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from database.models.user import User
from data_access.user_data_access import UserDataAccess

from core.roles import Roles
from core.security import hash_password, verify_password

from core.email import send_invite_email, send_reset_password_email

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

        user.invite_token = None
        user.invite_token_expiry = None

        update_data = {
            "password_hash": hashed_password,
            "invite_token": None,
            "invite_token_expiry": None,
            "is_active": True,
            "is_invited": False
        }

        return self.user_da.update_user(user, update_data)

    def get_users(self, current_user):

        if current_user.role != Roles.ADMIN:
            raise PermissionError("Only admins allowed")

        return self.user_da.get_all_users()
   
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

        valid, new_hash = verify_password(password, user.password_hash)

        if not valid:
            raise ValueError("Invalid credentials")

        if not user.is_active:
            raise ValueError("User is inactive")

        if new_hash:
            self.user_da.update_user(user, {"password_hash": new_hash})

        return user

    def resend_invite(
        self,
        current_user,
        user_id: int
    ):

        if current_user.role != Roles.ADMIN:
            raise PermissionError(
                "Only admins can resend invites"
            )

        user = self.user_da.get_user_by_id(
            user_id
        )

        if not user:
            raise ValueError("User not found")

        if user.password_hash:
            raise ValueError(
                "User already registered"
            )

        token = secrets.token_urlsafe(32)

        update_data = {
            "invite_token": token,
            "invite_token_expiry":
                datetime.utcnow() + timedelta(days=2),
            "updated_by": current_user.id,
            "is_invited": True
        }

        updated_user = self.user_da.update_user(
            user,
            update_data
        )

        send_invite_email(
            updated_user.email,
            token
        )

        return {
            "message":
                "Invite resent successfully"
        }

    def forgot_password(self, email: str):

        user = self.user_da.get_user_by_email(
            email.strip().lower()
        )

        if not user:
            return {
                "message":
                    "If the account exists, a reset email has been sent"
            }

        token = secrets.token_urlsafe(32)

        update_data = {
            "invite_token": token,
            "invite_token_expiry":
                datetime.utcnow() + timedelta(days=2)
        }

        self.user_da.update_user(
            user,
            update_data
        )

        send_reset_password_email(
            user.email,
            token
        )

        return {
            "message":
                "If the account exists, a reset email has been sent"
        }

    def reset_password(self, token: str, new_password: str):
        user = (
            self.user_da.get_user_by_invite_token(
                token
            )
        )

        if not user:
            raise ValueError(
                "Invalid token"
            )

        if (
            not user.invite_token_expiry
            or user.invite_token_expiry
            < datetime.utcnow()
        ):
            raise ValueError(
                "Token expired"
            )

        hashed_password = hash_password(
            new_password
        )

        update_data = {
            "password_hash":
                hashed_password,

            "invite_token": None,

            "invite_token_expiry": None,

            "is_invited": False
        }

        self.user_da.update_user(
            user,
            update_data
        )

        return {
            "message":
                "Password reset successful"
        }
    
    def update_user(self, current_user, user_id: int, data: dict):

        if current_user.role != Roles.ADMIN:
            raise PermissionError(
                "Only admins allowed"
            )


        user = self.user_da.get_user_by_id(user_id)

        if not user:
            raise ValueError(
                "User not found"
            )

        email = data.get("email")

        if not email or not email.strip():
            raise ValueError(
                "Email is required"
            )

        email = email.strip().lower()

        if not re.match(
            r"^[\w\.-]+@[\w\.-]+\.\w+$",
            email
        ):
            raise ValueError(
                "Invalid email format"
            )

        existing_user = (
            self.user_da.get_user_by_email(
                email
            )
        )
        if (
            existing_user
            and existing_user.id != user.id
        ):
            raise ValueError(
                "Email already in use"
            )

        role = data.get("role")

        if role not in Roles.ALL:
            raise ValueError(
                "Invalid role"
            )

        is_active = data.get("is_active")

        if is_active is None:
            raise ValueError(
                "is_active is required"
            )

        active_admin_count = (
            self.user_da.count_active_admins()
        )

        is_currently_active_admin = (
            user.role == Roles.ADMIN
            and user.is_active
        )

        will_lose_admin_access = (
            role != Roles.ADMIN
            or not is_active
        )

        if (
            is_currently_active_admin
            and will_lose_admin_access
            and active_admin_count <= 1
        ):
            raise ValueError(
                "Cannot remove the last active admin"
            )

        first_name = data.get("first_name")

        last_name = data.get("last_name")

        if first_name is not None:
            first_name = first_name.strip()

        if last_name is not None:
            last_name = last_name.strip()

        update_data = {
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "role": role,
            "is_active": is_active,
            "updated_by": current_user.id
        }

        return self.user_da.update_user(
            user,
            update_data
        )