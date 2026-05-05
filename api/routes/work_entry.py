from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user

from services.work_entry_service import WorkEntryService
from api.schemas.work_entry import (
    CreateWorkEntryRequest,
    WorkEntryResponse,
    WorkEntryItemResponse
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
        entry = service.create_or_update_work_entry(current_user, data.dict())

        items = service.item_da.get_items_by_work_entry(entry.id)

        return {
            "id": entry.id,
            "site_id": entry.site_id,
            "entry_date": entry.entry_date,
            "items": items
        }

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
        entry = service.entry_da.get_by_site_and_date(site_id, date)

        if not entry:
            raise HTTPException(status_code=404, detail="No work entry found")

        items = service.item_da.get_items_by_work_entry(entry.id)

        return {
            "id": entry.id,
            "site_id": entry.site_id,
            "entry_date": entry.entry_date,
            "items": items
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Error fetching work entry:", e)
        raise HTTPException(status_code=500, detail="Internal server error")