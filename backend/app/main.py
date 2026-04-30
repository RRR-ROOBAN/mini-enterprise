from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user_model, task_model
from app.routers import auth_router, task_router

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ Include routers
app.include_router(auth_router.router)
app.include_router(task_router.router)

@app.get("/")
def home():
    return {"message": "API is running"}


from app.database import engine, Base

Base.metadata.create_all(bind=engine)