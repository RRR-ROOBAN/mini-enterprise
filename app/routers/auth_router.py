from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user_model import User
from app.schemas.user_schema import UserCreate, UserLogin
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.services.role_service import require_role
from app.database import get_db


from fastapi import Depends
from app.services.auth_service import get_current_user


router = APIRouter(prefix="/auth", tags=["Auth"])




# 📝 Register
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


# 🔐 Login
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})

    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", dependencies=[Depends(get_current_user)])
def get_me(current_user = Depends(get_current_user)):
    return current_user

# @router.get("/admin-only")
# def admin_only(current_user = Depends(require_role(["admin"]))):
#     return {"message": "Welcome Admin"}

# @router.get("/manager-only")
# def manager_only(current_user = Depends(require_role(["admin", "manager"]))):
#     return {"message": "Admin or Manager allowed"}