from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from database import crud
from schemas.auth import UserRegister, UserLogin, UserResponse, Token
from utils.security import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, email=user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    hashed_pw = get_password_hash(user_data.password)
    new_user = crud.create_user(
        db=db,
        email=user_data.email,
        password_hash=hashed_pw,
        full_name=user_data.full_name
    )

    access_token = create_access_token(data={"sub": new_user.id, "email": new_user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=credentials.email)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user
