# I'm going to be completely real, I didn't write almost any of this. I just used CoPilot. I was trying to ask for
# Assistance in writing it, and then it wrote everything and changed the little I had barely setup.
# So I'm just gonna keep it cause it works, but I'm straight up telling you it changed a lot of my program.

from typing import Union
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# Database setup
DATABASE_URL = "sqlite:///./popquiz.db"  # Using SQLite for simplicity

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database model


class UserQuiz(Base):
    __tablename__ = "popquiz"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    cc = Column(String)
    expiration = Column(String)
    security = Column(String)
    ssn = Column(String)


Base.metadata.create_all(bind=engine)

# Pydantic schema for request/response


class UserQuizCreate(BaseModel):
    name: str
    age: int
    cc: str
    expiration: str
    security: str
    ssn: str


class UserQuizResponse(BaseModel):
    id: int
    name: str
    age: int

    class Config:
        from_attributes = True


# FastAPI app
app = FastAPI()

# Enable CORS so frontend can access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/submit-quiz")
def submit_quiz(user_data: UserQuizCreate, db: Session = None):
    """Endpoint to save quiz form data to database"""
    if db is None:
        db = SessionLocal()

    try:
        db_user = UserQuiz(**user_data.dict())
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"id": db_user.id, "message": "Data saved successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()


@app.get("/get-quiz/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = None):
    """Endpoint to retrieve quiz data"""
    if db is None:
        db = SessionLocal()

    try:
        user = db.query(UserQuiz).filter(UserQuiz.id == quiz_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return user
    finally:
        db.close()


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
