from sqlalchemy.orm import Session
from models import Task
from typing import Optional
from sqlalchemy.exc import NoResultFound

# Create a new task
def create_task_in_db(db: Session, title: str, description: str, owner_id: int):
    db_task = Task(title=title, description=description, owner_id=owner_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

# Get all tasks for a user
def get_all_tasks(db: Session, user_id: int, user_role: str):
    if user_role in ["admin", "manager"]:
        return db.query(Task).all()
    return db.query(Task).filter(Task.owner_id == user_id).all()

# Update a task's information (e.g., title or description)
def update_task_in_db(db: Session, task_id: int, title: str, description: str, status: str, user_id: int, owner_id: int):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise NoResultFound("Task not found or you are not assigned to this task.")
    db_task.title = title
    db_task.description = description
    db_task.status = status
    if owner_id is not None:
        db_task.owner_id = owner_id
    else:
        db_task.owner_id = None
    db.commit()
    db.refresh(db_task)
    return db_task

# Delete a task
def delete_task_in_db(db: Session, task_id: int, user_id: int):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task is None:
        raise NoResultFound("Task not found or you are not assigned to this task.")
    db.delete(db_task)
    db.commit()
    return db_task
