from fastapi import FastAPI
from app.database import engine, Base
from app.models import user_model
from app.routers import auth_router
from app.models import task_model
from app.routers import task_router




app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth_router.router)
app.include_router(task_router.router)

@app.get("/")
def home():
    return {"message": "API is running"}