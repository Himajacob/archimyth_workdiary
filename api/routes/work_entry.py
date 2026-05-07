from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user

from services.work_entry_service import WorkEntryService
from api.schemas.work_entry import (
    CreateWorkEntryRequest,
    WorkEntryResponse
)

router = APIRouter(prefix="/work-entries", tags=["Work Entries"])


@router.post("/", response_model=WorkEntryResponse)
def create_or_update_work_entry(
    data: CreateWorkEntryRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkEntryService(db)

    try:
        # ✅ Service now returns full structure (items + photos)
        entry = service.create_or_update_work_entry(current_user, data.dict())

        return entry

    except PermissionError:
        raise HTTPException(status_code=403, detail="Not allowed")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=WorkEntryResponse)
def get_work_entry(
    site_id: int = Query(...),
    date: str = Query(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkEntryService(db)

    try:
        # ✅ Clean service call
        entry = service.get_work_entry_with_details(site_id, date)

        if not entry:
            raise HTTPException(status_code=404, detail="No work entry found")

        return entry

    except HTTPException:
        raise

    except Exception as e:
        print("Error fetching work entry:", e)
        raise HTTPException(status_code=500, detail="Internal server error")
    

@router.delete("/items/{item_id}")
def delete_work_entry_item(
    item_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkEntryService(db)

    try:
        return service.delete_work_entry_item(current_user, item_id)

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        print("Delete item error:", e)
        raise HTTPException(status_code=500, detail="Failed to delete item")
    

@router.delete("/{work_entry_id}")
def delete_work_entry(
    work_entry_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    service = WorkEntryService(db)

    try:

        return service.delete_work_entry(
            current_user,
            work_entry_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

    except Exception as e:

        print("Delete work entry error:", e)

        raise HTTPException(
            status_code=500,
            detail="Failed to delete work entry"
        )