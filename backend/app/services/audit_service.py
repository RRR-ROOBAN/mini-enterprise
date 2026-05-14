from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.audit_log_model import AuditLog


# ✅ Get Logs
def get_all_audit_logs(
    db: Session
):

    statement = select(AuditLog)

    result = db.execute(statement)

    logs = result.scalars().all()

    return logs


# ✅ Create Audit Log
def create_audit_log(
    db: Session,
    user_id: int,
    action: str,
    entity: str,
    entity_id: int
):

    log = AuditLog(

        user_id=user_id,

        action=action,

        entity=entity,

        entity_id=entity_id
    )

    db.add(log)

    db.commit()

    return log