from passlib.context import CryptContext

from jose import jwt, JWTError

from datetime import (
    datetime,
    timedelta
)

from fastapi import (
    Depends,
    HTTPException
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlalchemy import select

from app.database import SessionLocal

from app.models.user_model import User


SECRET_KEY = "RRR123"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

security = HTTPBearer()


# ✅ Hash Password
def hash_password(password: str):

    return pwd_context.hash(password)


# ✅ Verify Password
def verify_password(
    plain_password,
    hashed_password
):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# ✅ Create JWT Token
def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# ✅ Register Service
def register_service(
    user,
    db
):

    query = select(User).where(
        User.email == user.email
    )

    existing_user = db.execute(
        query
    ).scalars().first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hash_password(
            user.password
        ),
        role=user.role
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# ✅ Login Service
def login_service(
    user,
    db
):

    query = select(User).where(
        User.email == user.email
    )

    db_user = db.execute(
        query
    ).scalars().first()

    if (
        not db_user
        or not verify_password(
            user.password,
            db_user.hashed_password
        )
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "sub": db_user.email
    })

    return {

        "access_token": token,

        "token_type": "bearer",

        "role": db_user.role
    }


# ✅ Get Current User
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if email is None:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    db = SessionLocal()

    query = select(User).where(
        User.email == email
    )

    user = db.execute(
        query
    ).scalars().first()

    db.close()

    if user is None:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user