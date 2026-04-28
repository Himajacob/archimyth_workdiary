from sqlalchemy import Column, ForeignKey, Integer, Date, TIMESTAMP, ForeignKey, text, UniqueConstraint
from database.base import Base


class WorkEntry(Base):
    __tablename__ = "work_entries"

    id = Column(Integer, primary_key=True, index=True)

    site_id = Column(
        Integer,
        ForeignKey("sites.id", ondelete="RESTRICT"),
        nullable=False
    )

    entry_date = Column(Date, nullable=False)

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
        UniqueConstraint("site_id", "entry_date", name="uq_site_date"),
    )