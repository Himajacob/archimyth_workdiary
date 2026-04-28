from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, text, CheckConstraint, Date
from database.base import Base



class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)

    client_id = Column(
        Integer,
        ForeignKey("clients.id", ondelete="RESTRICT"),
        nullable=False
    )

    project_name = Column(String, nullable=False)
    location = Column(String, nullable=False)

    start_date = Column(Date, nullable=False)

    duration_days = Column(Integer, nullable=True)

    status = Column(String(20), nullable=False)

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
        CheckConstraint("char_length(trim(project_name)) > 0", name="check_project_name"),
        CheckConstraint("char_length(trim(location)) > 0", name="check_location"),
        CheckConstraint(
            "duration_days IS NULL OR duration_days > 0",
            name="check_duration_days"
        ),
        CheckConstraint(
            "status IN ('in_progress','completed','cancelled','paused')",
            name="check_site_status"
        ),
    )