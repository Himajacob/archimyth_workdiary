from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.user import InviteUserRequest
from services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user.id,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "role": current_user.role,
    }

@router.patch("/me")
def update_me(
    data: dict,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = UserService(db)
    try:
        return service.update_me(current_user, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

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

@router.get("/")
def get_users(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = UserService(db)

    return service.get_users(current_user)

@router.patch("/{user_id}")
def update_user(
    user_id: int,
    data: dict,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = UserService(db)

    try:

        return service.update_user(
            current_user,
            user_id,
            data
        )

    except PermissionError:

        raise HTTPException(
            status_code=403,
            detail="Only admins allowed"
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/{user_id}/resend-invite")
def resend_invite(
    user_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = UserService(db)

    try:

        return service.resend_invite(
            current_user,
            user_id
        )

    except PermissionError:

        raise HTTPException(
            status_code=403,
            detail="Only admins allowed"
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )