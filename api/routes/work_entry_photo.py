from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Request
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user

from services.work_entry_photo_service import WorkEntryPhotoService
from api.schemas.work_entry_photo import WorkEntryPhotoResponse

router = APIRouter(prefix="/work-entry-photos", tags=["Work Entry Photos"])


@router.post("/", response_model=WorkEntryPhotoResponse)
async def upload_photo(
    request: Request,
    work_entry_item_id: int = Form(...),
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkEntryPhotoService(db)

    try:
        photo = service.upload_photo(
            request=request,
            current_user=current_user,
            work_entry_item_id=work_entry_item_id,
            file=file
        )

        return photo

    except PermissionError:
        raise HTTPException(status_code=403, detail="Not allowed")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print("Upload error:", e)
        raise HTTPException(status_code=500, detail="Upload failed")


@router.delete("/{photo_id}")
def delete_photo(
    photo_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = WorkEntryPhotoService(db)

    try:
        return service.delete_photo(current_user, photo_id)

    except PermissionError:
        raise HTTPException(status_code=403, detail="Not allowed")

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        print("Delete error:", e)
        raise HTTPException(status_code=500, detail="Delete failed")