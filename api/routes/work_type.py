from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.work_type import CreateWorkTypeRequest, WorkTypeResponse, WorkTypeListResponse
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


@router.get("/", response_model=List[WorkTypeResponse])
def get_work_types(
    show_inactive: bool = False,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkTypeService(db)

    try:
        return service.get_work_types(
        current_user,
        show_inactive)

    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

@router.patch(
    "/{work_type_id}/activate",
    response_model=WorkTypeResponse
)
def activate_work_type(
    work_type_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkTypeService(db)

    try:
        return service.activate_work_type(
            current_user,
            work_type_id
        )

    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail="Only admins can activate work types"
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.patch(
    "/{work_type_id}/deactivate",
    response_model=WorkTypeResponse
)
def deactivate_work_type(
    work_type_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkTypeService(db)

    try:
        return service.deactivate_work_type(
            current_user,
            work_type_id
        )

    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail="Only admins can deactivate work types"
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
