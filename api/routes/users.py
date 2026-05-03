from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.user import InviteUserRequest
from services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/invite")
def invite_user(
    data: InviteUserRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_service = UserService(db)

    try:
        user = user_service.invite_user(current_user, data.dict())

        return {
            "message": "User invited successfully",
            "user_id": user.id
        }

    except PermissionError:
        raise HTTPException(status_code=403, detail="Admins only")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

