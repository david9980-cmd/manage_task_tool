from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from services import auth_services
from database import get_db
from schemas import UserCreate
from utils import create_jwt_token

router = APIRouter()

# User Registration
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = auth_services.create_user(db, user.email, user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return {"email": db_user.email, "role": db_user.role}

# User Login
@router.post("/login")
def login(form_data: UserCreate, db: Session = Depends(get_db)):
    user = auth_services.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_jwt_token(user.email)
    return {"token": token, "user": { "role": user.role, "email": user.email }}

@router.get("/employees")
def get_all_employees(db: Session = Depends(get_db)):
    employees = auth_services.get_all_employees(db)
    if not employees:
        raise HTTPException(status_code=404, detail="No users found")
    
    return [{"email": user.email, "role": user.role, "id": user.id} for user in employees]
