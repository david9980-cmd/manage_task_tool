# services/auth_services.py
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User
from utils import pwd_context

# Initialize password hashing context (imported from utils)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

# Create a new user (register)
def create_user(db: Session, email: str, password: str):
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise ValueError("Email already registered")

    hashed_password = pwd_context.hash(password)
    db_user = User(email=email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Authenticate user with email and password
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if user and pwd_context.verify(password, user.password):
        return user
    return None

def get_all_employees(db: Session):
    # Fetch only users with the role 'employee' from the database
    return db.query(User).filter(User.role == 'employee').all()
