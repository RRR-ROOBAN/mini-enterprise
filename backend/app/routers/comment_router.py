from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.comment_schema import (
    CommentCreate
)

from app.services.auth_service import (
    get_current_user
)

from app.services.comment_service import (

    add_comment_service,

    get_comments_service
)

router = APIRouter(
    prefix="/tasks",
    tags=["Comments"]
)


# ✅ Add Comment
@router.post("/{task_id}/comments")
def add_comment(
    task_id: int,
    data: CommentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return add_comment_service(
        task_id,
        data,
        db,
        current_user
    )


# ✅ Get Comments
@router.get("/{task_id}/comments")
def get_comments(
    task_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_comments_service(
        task_id,
        db,
        current_user
    )