from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from services import task_services
from database import get_db
from schemas import TaskCreate, Task, User
from utils import get_current_user

router = APIRouter()

# Create a new Task
@router.post("/", response_model=Task)
def create_task(task: TaskCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return task_services.create_task_in_db(db, task.title, task.description, task.owner_id)

# Get tasks for the current user based on their role
@router.get("/", response_model=List[Task])
def get_tasks(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return task_services.get_all_tasks(db, user.id, user.role)

# Update a task
@router.put("/{task_id}", response_model=Task)
def update_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return task_services.update_task_in_db(
            db, task_id, task.title, task.description, task.status, user.id, task.owner_id
        )
    except NoResultFound as e:
        raise HTTPException(status_code=404, detail=str(e))

# Delete a task
@router.delete("/{task_id}", response_model=Task)
def delete_task(task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        return task_services.delete_task_in_db(db, task_id, user.id)
    except NoResultFound as e:
        raise HTTPException(status_code=404, detail=str(e))
