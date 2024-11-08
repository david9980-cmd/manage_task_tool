from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class UserRole(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    employee = "employee"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))
    role = Column(Enum(UserRole), default=UserRole.employee)

class TaskStatus(str, enum.Enum):
    to_do = "To do"
    pending = "pending"
    in_progress = "in_progress"
    done = "done"
    deployed = "deployed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    description = Column(String(255))
    status = Column(String(50), default=TaskStatus.to_do)
    due_date = Column(DateTime)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    owner = relationship("User", back_populates="tasks")

User.tasks = relationship("Task", back_populates="owner")
