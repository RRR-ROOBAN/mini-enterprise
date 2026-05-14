from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.services.auth_service import (
    get_current_user
)

from app.services.notification_service import (

    get_notifications_service,

    mark_notification_read_service
)

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# ✅ Get Notifications
@router.get("/")
def get_notifications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return get_notifications_service(
        db,
        current_user
    )


# ✅ Mark Read
@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return mark_notification_read_service(
        notification_id,
        db,
        current_user
    )