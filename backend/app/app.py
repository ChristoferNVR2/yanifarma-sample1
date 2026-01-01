from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud
from .database import localSession, engine
from .schemas import UserData, UserId
from .models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()
origin = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = localSession()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Hello, World!"}


@app.get("/api/users/", response_model=list[UserId])
def get_users(db: Session = Depends(get_db)):
    return crud.get_users(db=db)


@app.get("/api/users/{id:int}", response_model=UserId)
def get_user(id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db=db, user_id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/api/users/", response_model=UserId)
def create_user(user: UserData, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_name(db=db, name=user.name)
    if db_user:
        raise HTTPException(status_code=400, detail="User already exists")
    return crud.create_user(db=db, user=user)
