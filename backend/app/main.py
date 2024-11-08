# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
from routers import auth, tasks
from database import SessionLocal, engine, Base

# Create FastAPI instance
app = FastAPI()

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for auth and tasks
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])

# Create database tables

Base.metadata.create_all(bind=engine)

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
