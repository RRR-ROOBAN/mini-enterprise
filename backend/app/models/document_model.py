from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship

from datetime import datetime

from app.database import Base


class Document(Base):

    __tablename__ = "documents"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    file_name = Column(
        String(255),
        nullable=False
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    version = Column(
        Integer,
        default=1
    )

    uploaded_by = Column(
        Integer,
        ForeignKey("users.id")
    )

    task_id = Column(
        Integer,
        ForeignKey("tasks.id")
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # ✅ Relationships
    task = relationship("Task")

    user = relationship("User")