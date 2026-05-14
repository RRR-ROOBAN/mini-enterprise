from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.approval_schema import (
    ApprovalCreate,
    ApprovalAction
)

from app.services.auth_service import (
    get_current_user
)

from app.services.approval_service import (

    create_approval_service,

    get_approvals_service,

    approval_action_service,

    get_history_service
)

router = APIRouter(
    prefix="/approvals",
    tags=["Approvals"]
)


# ✅ Create Approval
@router.post("/")
def create_approval(
    data: ApprovalCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return create_approval_service(
        data,
        db,
        current_user
    )


# ✅ Get Approvals
@router.get("/")
def get_approvals(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_approvals_service(
        db,
        current_user
    )


# ✅ Approval Action
@router.patch("/{approval_id}/action")
def approval_action(
    approval_id: int,
    data: ApprovalAction,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return approval_action_service(
        approval_id,
        data,
        db,
        current_user
    )


# ✅ Approval History
@router.get("/{approval_id}/history")
def get_history(
    approval_id: int,
    db: Session = Depends(get_db)
):

    return get_history_service(
        approval_id,
        db
    )