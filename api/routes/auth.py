from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from dependencies.db import get_db
from services.user_service import UserService
from core.auth import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user_service = UserService(db)

    try:
        user = user_service.authenticate_user(
            email=data.get("email"),
            password=data.get("password")
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