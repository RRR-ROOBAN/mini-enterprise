from sqlalchemy import (Column,Integer,String,Boolean,DateTime)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):

    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100),unique=True,index=True)
    hashed_password = Column(String(255))
    role = Column(String(50))
    is_active = Column(Boolean,default=True)
    created_at = Column(DateTime,default=datetime.utcnow)
    updated_at = Column(DateTime,default=datetime.utcnow)

    # ✅ RELATIONSHIP

    assigned_tasks = relationship("Task",foreign_keys="Task.assigned_to_id")