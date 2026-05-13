from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, text, CheckConstraint

from database.base import Base


class WorkType(Base):
    __tablename__ = "work_types"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False, unique=True)

    is_active = Column(Boolean, nullable=False, server_default=text("true"))

    created_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    updated_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False
    )

    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
        nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "char_length(trim(name)) > 0",
            name="check_work_type_name"
        ),
    )