from sqlalchemy.orm import Session

from sqlalchemy import select

from fastapi import HTTPException

from app.models.notification_model import Notification


# ✅ Create Notification
def create_notification(
    db: Session,
    user_id: int,
    message: str
):

    notification = Notification(
        user_id=user_id,
        message=message
    )

    db.add(notification)

    db.commit()

    db.refresh(notification)

    return notification


# ✅ Get Notifications
def get_notifications_service(
    db: Session,
    current_user
):

    query = select(Notification).where(
        Notification.user_id == current_user.id
    )

    notifications = db.execute(
        query
    ).scalars().all()

    return notifications


# ✅ Mark Notification Read
def mark_notification_read_service(
    notification_id: int,
    db: Session,
    current_user
):

    query = select(Notification).where(
        Notification.id == notification_id
    )

    notification = db.execute(
        query
    ).scalars().first()

    if not notification:

        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    if notification.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    # ✅ Mark Read
    notification.is_read = True

    db.commit()

    db.refresh(notification)

    return notification