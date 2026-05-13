from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, text, CheckConstraint
from database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String, nullable=True)
    role = Column(String(50), nullable=False)

    invite_token = Column(String(255), unique=True, nullable=True, index=True)
    invite_token_expiry = Column(TIMESTAMP, nullable=True)
    is_invited = Column(Boolean, nullable=False, server_default=text("false"))

    is_active = Column(Boolean, nullable=False, server_default=text("true"))
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False
    )
    updated_at = Column(
        TIMESTAMP,
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
        nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "role IN ('admin','site_manager')",
            name="check_user_role"
        ),
    )