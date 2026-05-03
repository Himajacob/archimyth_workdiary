from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.schemas.auth import LoginRequest, RegisterUserRequest

from api.dependencies.db import get_db
from services.user_service import UserService
from core.auth import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user_service = UserService(db)

    try:
        user = user_service.authenticate_user(
            email=data.email,
            password=data.password
        )
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/register")
def register(data: RegisterUserRequest, db: Session = Depends(get_db)):
    user_service = UserService(db)

    try:
        user_service.register_user(data.token, data.password)
        return {"message": "User registered successfully"}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))