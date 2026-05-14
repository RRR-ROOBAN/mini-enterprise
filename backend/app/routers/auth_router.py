from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.user_schema import (
    UserCreate,
    UserLogin
)

from app.services.auth_service import (

    register_service,

    login_service,

    get_current_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


# ✅ Register
@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    return register_service(
        user,
        db
    )


# ✅ Login
@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    return login_service(
        user,
        db
    )


# ✅ Current User
@router.get("/me")
def get_me(
    current_user = Depends(get_current_user)
):

    return current_user