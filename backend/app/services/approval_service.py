from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import select


from app.models.approval_model import Approval
from app.models.approval_history_model import ApprovalHistory

from app.schemas.approval_schema import (
    ApprovalCreate,
    ApprovalAction
)

from app.services.audit_service import (
    create_audit_log
)

from app.services.notification_service import (
    create_notification
)


# ✅ Create Approval
def create_approval_service(
    data: ApprovalCreate,
    db: Session,
    current_user
):

    if current_user.role != "employee":

        raise HTTPException(
            status_code=403,
            detail="Only employees can request"
        )

    approval = Approval(
        title=data.title,
        description=data.description,
        requested_by=current_user.id,
        status="pending",
        current_level="manager"
    )
    
    create_notification(
    db=db,
    user_id=approval.requested_by,
    message=f"Your approval request was {approval.status}"
)

    db.add(approval)

    db.commit()

    db.refresh(approval)

    # ✅ Audit Log
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action="approval requested",
        entity="approval",
        entity_id=approval.id
    )

    return approval


# ✅ Get Approvals
def get_approvals_service(
    db: Session,
    current_user
):

    query = select(Approval)

    if current_user.role == "employee":

        query = query.where(
            Approval.requested_by == current_user.id
        )

    approvals = db.execute(
        query
    ).scalars().all()

    return approvals


# ✅ Approval Action
def approval_action_service(
    approval_id: int,
    data: ApprovalAction,
    db: Session,
    current_user
):

    query = select(Approval).where(
        Approval.id == approval_id
    )

    approval = db.execute(
        query
    ).scalars().first()

    if not approval:

        raise HTTPException(
            status_code=404,
            detail="Approval not found"
        )

    if approval.status in [
        "approved",
        "rejected"
    ]:

        raise HTTPException(
            status_code=400,
            detail="Already completed"
        )

    if current_user.role not in [
        "manager",
        "admin"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    action = data.action.lower()

    # ✅ Reject comment mandatory
    if (
        action == "rejected"
        and not data.comment
    ):

        raise HTTPException(
            status_code=400,
            detail="Comment required"
        )

    # ✅ Approval workflow
    if action == "approved":

        approval.status = "approved"

    elif action == "rejected":

        approval.status = "rejected"

    elif action == "hold":

        approval.status = "hold"

    else:

        raise HTTPException(
            status_code=400,
            detail="Invalid action"
        )

    # ✅ Save history
    history = ApprovalHistory(
        approval_id=approval.id,
        action_by=current_user.id,
        action=action,
        comment=data.comment
    )

    db.add(history)

    db.commit()

    db.refresh(approval)

    # ✅ Audit Log
    create_audit_log(
        db=db,
        user_id=current_user.id,
        action=action,
        entity="approval",
        entity_id=approval.id
    )

    return approval


# ✅ Approval History
def get_history_service(
    approval_id: int,
    db: Session
):

    query = select(ApprovalHistory).where(
        ApprovalHistory.approval_id == approval_id
    )

    history = db.execute(
        query
    ).scalars().all()

    return history