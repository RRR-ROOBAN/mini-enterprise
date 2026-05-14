import os

import shutil

from fastapi import (
    UploadFile,
    HTTPException
)

from fastapi.responses import (
    FileResponse
)

from sqlalchemy.orm import Session

from sqlalchemy import select

from app.models.document_model import (
    Document
)

from app.models.task_model import (
    Task
)


UPLOAD_FOLDER = "uploads"


# ✅ Upload Document
def upload_document_service(
    task_id: int,
    file: UploadFile,
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

    os.makedirs(
        UPLOAD_FOLDER,
        exist_ok=True
    )

    existing_query = select(Document).where(
        Document.task_id == task_id,
        Document.file_name == file.filename
    )

    existing_docs = db.execute(
        existing_query
    ).scalars().all()

    version = len(existing_docs) + 1

    file_path = (
        f"{UPLOAD_FOLDER}/v{version}_{file.filename}"
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    document = Document(
        file_name=file.filename,
        file_path=file_path,
        version=version,
        uploaded_by=current_user.id,
        task_id=task_id
    )

    db.add(document)

    db.commit()

    db.refresh(document)

    return document


# ✅ Get Document
def get_document_service(
    document_id: int,
    db: Session
):

    query = select(Document).where(
        Document.id == document_id
    )

    document = db.execute(
        query
    ).scalars().first()

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return document


# ✅ Get Task Documents
def get_task_documents_service(
    task_id: int,
    db: Session
):

    query = select(Document).where(
        Document.task_id == task_id
    )

    documents = db.execute(
        query
    ).scalars().all()

    return documents


# ✅ Download Document
def download_document_service(
    document_id: int,
    db: Session
):

    query = select(Document).where(
        Document.id == document_id
    )

    document = db.execute(
        query
    ).scalars().first()

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    return FileResponse(
        path=document.file_path,
        filename=document.file_name,
        media_type="application/octet-stream"
    )