from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.work_type import CreateWorkTypeRequest
from services.work_type_service import WorkTypeService

router = APIRouter(prefix="/work-types", tags=["Work Types"])


@router.post("/")
def create_work_type(
    data: CreateWorkTypeRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkTypeService(db)

    try:
        wt = service.create_work_type(current_user, data.dict())

        return {
            "id": wt.id,
            "name": wt.name
        }

    except PermissionError:
        raise HTTPException(status_code=403, detail="Only admins can create work types")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def get_work_types(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkTypeService(db)

    try:
        wts = service.get_work_types(current_user)

        return [
            {
                "id": wt.id,
                "name": wt.name
            }
            for wt in wts
        ]

    except PermissionError:
        raise HTTPException(status_code=403, detail="Not allowed")