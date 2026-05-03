from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from api.dependencies.db import get_db
from api.dependencies.current_user import get_current_user
from api.schemas.site import CreateSiteRequest
from services.site_service import SiteService

router = APIRouter(prefix="/sites", tags=["Sites"])


@router.post("/")
def create_site(
    data: CreateSiteRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = SiteService(db)

    try:
        site = service.create_site(current_user, data.dict())

        return {
            "id": site.id,
            "project_name": site.project_name,
            "location": site.location,
            "status": site.status
        }

    except PermissionError:
        raise HTTPException(status_code=403, detail="Only admins can create sites")

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
def get_sites(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = SiteService(db)

    try:
        sites = service.get_sites(current_user)

        return [
            {
                "id": s.id,
                "project_name": s.project_name,
                "location": s.location,
                "status": s.status,
                "client_id": s.client_id
            }
            for s in sites
        ]

    except PermissionError:
        raise HTTPException(status_code=403, detail="Not allowed")