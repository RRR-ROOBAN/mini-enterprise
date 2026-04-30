from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.task_model import Task
from app.schemas.task_schema import TaskCreate
from app.services.auth_service import get_current_user
from app.services.role_service import require_role
from app.database import get_db
from fastapi import HTTPException
from app.models.user_model import User



router = APIRouter(prefix="/tasks", tags=["Tasks"])




# ✅ Create Task (Admin + Manager)
@router.post("/")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    # ✅ Get assigned user from DB
    assigned_user: User = db.query(User).filter(User.id == task.assigned_to_id).first()

    # ❗ Check user exists
    if not assigned_user:
        raise HTTPException(status_code=404, detail="Assigned user not found")

    # ❗ Allow only employee
    if assigned_user.role!= "employee":
        raise HTTPException(
            status_code=400,
            detail="Task can only be assigned to an employee"
        )

    # ✅ Create task
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

    return new_task


# ✅ View Tasks (Role-based)
@router.get("/")
def get_tasks(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(Task).all()

    elif current_user.role == "manager":
        return db.query(Task).filter(
            Task.created_by_id == current_user.id
        ).all()

    else:  # employee
        return db.query(Task).filter(
            Task.assigned_to_id == current_user.id
        ).all()
        
@router.put("/{task_id}")
def update_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    existing_task = db.query(Task).filter(Task.id == task_id).first()

    if not existing_task:
        raise HTTPException(status_code=404, detail="Task not found")

    existing_task.title = task.title
    existing_task.description = task.description
    existing_task.priority = task.priority
    existing_task.due_date = task.due_date

    db.commit()
    db.refresh(existing_task)

    return existing_task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin","manager"]))
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/status")
def update_status(
    task_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # ❗ Only assigned employee can update
    if current_user.role == "employee" and task.assigned_to_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    task.status = status
    db.commit()
    db.refresh(task)

    return task