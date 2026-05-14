from fastapi import FastAPI

from fastapi.middleware.cors import (
    CORSMiddleware
)

from app.database import (
    engine,
    Base
)

# ✅ Import Models
from app.models import (
    user_model,
    task_model,
    approval_model,
    approval_history_model,
    comment_model,
    audit_log_model,
    notification_model,
    document_model
)

# ✅ Import Routers
from app.routers.auth_router import (
    router as auth_router
)

from app.routers.task_router import (
    router as task_router
)

from app.routers.approval_router import (
    router as approval_router
)

from app.routers.comment_router import (
    router as comment_router
)

from app.routers.dashboard_router import (
    router as dashboard_router
)

from app.routers.audit_router import (
    router as audit_router
)

from app.routers.notification_router import (
    router as notification_router
)

from app.routers.document_router import (
    router as document_router
)


app = FastAPI()


# ✅ CORS
app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ✅ Create Tables
Base.metadata.create_all(
    bind=engine
)


# ✅ Include Routers
app.include_router(auth_router)

app.include_router(task_router)

app.include_router(approval_router)

app.include_router(comment_router)

app.include_router(dashboard_router)

app.include_router(audit_router)

app.include_router(notification_router)

app.include_router(document_router)


@app.get("/")
def home():

    return {
        "message": "API is running"
    }