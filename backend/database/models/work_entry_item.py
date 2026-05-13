from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, text, CheckConstraint
from database.base import Base


class WorkEntryItem(Base):
    __tablename__ = "work_entry_items"

    id = Column(Integer, primary_key=True, index=True)

    work_entry_id = Column(
        Integer,
        ForeignKey("work_entries.id", ondelete="CASCADE"),
        nullable=False
    )

    work_type_id = Column(
        Integer,
        ForeignKey("work_types.id", ondelete="RESTRICT"),
        nullable=True
    )

    workers_count = Column(Integer, nullable=False)

    remarks = Column(String, nullable=True)

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
        CheckConstraint("workers_count >= 0", name="check_workers_count"),
        CheckConstraint(
            "remarks IS NULL OR char_length(trim(remarks)) > 0",
            name="check_remarks"
        ),
    )