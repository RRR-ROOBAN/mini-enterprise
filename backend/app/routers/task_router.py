from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.task_schema import TaskCreate

from app.services.auth_service import get_current_user
from app.services.role_service import require_role

from app.services.task_service import (
    create_task_service,
    get_tasks_service,
    update_task_service,
    delete_task_service,
    update_status_service,
    get_kanban_tasks_service
)

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# ✅ Create Task
@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role(["admin", "manager"])
    )
):

    return create_task_service(
        task,
        db,
        current_user
    )


# ✅ Get Tasks
@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_tasks_service(
        db,
        current_user
    )


# ✅ Update Task
@router.put("/{task_id}")
def update_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role(["admin", "manager"])
    )
):

    return update_task_service(
        task_id,
        task,
        db
    )


# ✅ Delete Task
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role(["admin", "manager"])
    )
):

    return delete_task_service(
        task_id,
        db
    )


# ✅ Update Status
@router.patch("/{task_id}/status")
def update_status(
    task_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return update_status_service(
        task_id,
        status,
        db,
        current_user
    )


# ✅ Kanban
@router.get("/kanban")
def get_kanban_tasks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_kanban_tasks_service(
        db,
        current_user
    )