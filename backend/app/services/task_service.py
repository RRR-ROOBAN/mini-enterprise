from fastapi import HTTPException

from sqlalchemy.orm import (
    Session,
    selectinload
)

from sqlalchemy import select

from app.models.task_model import Task
from app.models.user_model import User

from app.schemas.task_schema import TaskCreate

from app.utils.workflow import VALID_TRANSITIONS

from app.services.audit_service import (
    create_audit_log
)

from app.services.notification_service import (
    create_notification
)


# ✅ Create Task
def create_task_service(
    task: TaskCreate,
    db: Session,
    current_user
):

    query = select(User).where(
        User.id == task.assigned_to_id
    )

    assigned_user = db.execute(
        query
    ).scalars().first()

    if not assigned_user:

        raise HTTPException(
            status_code=404,
            detail="Assigned user not found"
        )

    if assigned_user.role != "employee":

        raise HTTPException(
            status_code=400,
            detail="Task can only be assigned to employee"
        )

    new_task = Task(
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date,
        created_by_id=current_user.id,
        assigned_to_id=task.assigned_to_id
    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)

    # ✅ Audit Log
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="created",
        entity="task",
        entity_id=new_task.id
    )

    # ✅ Employee Notification
    create_notification(
        db=db,
        user_id=new_task.assigned_to_id,
        message=f"New task assigned: {new_task.title}"
    )

    # ✅ Manager/Admin Notification
    create_notification(
        db=db,
        user_id=current_user.id,
        message=f"You created task: {new_task.title}"
    )

    return new_task


# ✅ Get Tasks
def get_tasks_service(
    db: Session,
    current_user
):

    query = select(Task).options(
        selectinload(Task.assigned_user)
    )

    if current_user.role == "manager":

        query = query.where(
            Task.created_by_id == current_user.id
        )

    elif current_user.role == "employee":

        query = query.where(
            Task.assigned_to_id == current_user.id
        )

    tasks = db.execute(
        query
    ).scalars().all()

    return tasks


# ✅ Update Task
def update_task_service(
    task_id: int,
    task: TaskCreate,
    db: Session
):

    query = select(Task).where(
        Task.id == task_id
    )

    existing_task = db.execute(
        query
    ).scalars().first()

    if not existing_task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.priority = task.priority
    existing_task.due_date = task.due_date

    db.commit()

    db.refresh(existing_task)

    # ✅ Audit Log
    create_audit_log(
        db=db,
        user_id=existing_task.created_by_id,
        action="updated",
        entity="task",
        entity_id=existing_task.id
    )

    return existing_task


# ✅ Delete Task
def delete_task_service(
    task_id: int,
    db: Session
):

    query = select(Task).where(
        Task.id == task_id
    )

    task = db.execute(
        query
    ).scalars().first()

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)

    db.commit()

    # ✅ Audit Log
    create_audit_log(
        db=db,
        user_id=task.created_by_id,
        action="deleted",
        entity="task",
        entity_id=task.id
    )

    return {
        "message": "Task deleted successfully"
    }


# ✅ Update Status
def update_status_service(
    task_id: int,
    status: str,
    db: Session,
    current_user
):

    query = select(Task).where(
        Task.id == task_id
    )

    task = db.execute(
        query
    ).scalars().first()

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if (
        current_user.role == "employee"
        and task.assigned_to_id != current_user.id
    ):

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    current_status = (
        task.status or "todo"
    ).lower()

    new_status = status.lower()

    if new_status not in VALID_TRANSITIONS[current_status]:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid transition from {current_status} to {new_status}"
        )

    task.status = new_status

    db.commit()

    db.refresh(task)

    # ✅ Audit Log
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action=f"status changed to {new_status}",
        entity="task",
        entity_id=task.id
    )

    return task


# ✅ Kanban Tasks
def get_kanban_tasks_service(
    db: Session,
    current_user
):

    query = select(Task).options(
        selectinload(Task.assigned_user)
    )

    if current_user.role == "manager":

        query = query.where(
            Task.created_by_id == current_user.id
        )

    elif current_user.role == "employee":

        query = query.where(
            Task.assigned_to_id == current_user.id
        )

    tasks = db.execute(
        query
    ).scalars().all()

    kanban = {
        "todo": [],
        "in_progress": [],
        "review": [],
        "done": []
    }

    for task in tasks:

        status = (
            task.status or "todo"
        ).lower()

        if status not in kanban:

            status = "todo"

        kanban[status].append({

            "id": task.id,

            "title": task.title,

            "description": task.description,

            "priority": task.priority,

            "assigned_user": (
                task.assigned_user.name
                if task.assigned_user
                else None
            )
        })

    return kanban