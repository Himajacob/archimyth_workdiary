from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, text, CheckConstraint
from database.base import Base


class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(String(500), nullable=True)
    contact_number = Column(String(20), nullable=True)
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
        CheckConstraint("char_length(name) > 0", name="check_client_name_not_empty"),
        CheckConstraint("char_length(contact_number) > 0", name="check_contact_not_empty"),
    )