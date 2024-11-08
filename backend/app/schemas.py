from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    tasks: List["Task"] = []

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    owner_id: int
    status: str

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    status: str
    owner_id: int

    class Config:
        from_attributes = True
