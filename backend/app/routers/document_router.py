from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.document_schema import (
    DocumentResponse
)

from app.services.document_service import (
    upload_document_service,
    get_document_service,
    get_task_documents_service,
    download_document_service
)

from app.services.auth_service import (
    get_current_user
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


# ✅ Upload Document
@router.post(
    "/upload/{task_id}",
    response_model=DocumentResponse
)
def upload_document(
    task_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    return upload_document_service(
        task_id,
        file,
        db,
        current_user
    )


# ✅ Download Document
@router.get(
    "/download/{document_id}"
)
def download_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    return download_document_service(
        document_id,
        db
    )


# ✅ Task Documents
@router.get(
    "/task/{task_id}",
    response_model=list[DocumentResponse]
)
def get_task_documents(
    task_id: int,
    db: Session = Depends(get_db)
):

    return get_task_documents_service(
        task_id,
        db
    )


# ✅ Get Document
@router.get(
    "/{document_id}",
    response_model=DocumentResponse
)
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    return get_document_service(
        document_id,
        db
    )