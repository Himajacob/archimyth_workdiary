from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, text, CheckConstraint
from database.base import Base


class WorkEntryPhoto(Base):
    __tablename__ = "work_entry_photos"

    id = Column(Integer, primary_key=True, index=True)

    work_entry_id = Column(
        Integer,
        ForeignKey("work_entries.id", ondelete="CASCADE"),
        nullable=False
    )

    photo_url = Column(String, nullable=False)

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

    uploaded_at = Column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "char_length(trim(photo_url)) > 0",
            name="check_photo_url"
        ),
    )